from pydantic import BaseModel
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from .goal_achiever_auth import get_current_user
from DB import mongodb

router = APIRouter()

class MilestoneCreate(BaseModel):
    title: str
    description: str
    startDate: datetime
    endDate: datetime



class GoalCreate(BaseModel):
    title: str
    description: str
    startDate: datetime
    endDate: datetime
    milestones: List[MilestoneCreate]

@router.post("/projects/goal_achiever/create_goal")
async def create_goal(
    data: GoalCreate,
    current_user: dict = Depends(get_current_user)
):
    db = mongodb.db.goals

    # ------------------ BASIC VALIDATION ------------------
    # if data.endDate < data.startDate:
    #     raise HTTPException(
    #         status_code=400,
    #         detail="Goal endDate must be after startDate"
    #     )

    # if len(data.milestones) == 0:
    #     raise HTTPException(
    #         status_code=400,
    #         detail="At least one milestone is required"
    #     )

    # ------------------ MILESTONE VALIDATION ------------------
    previous_end = data.startDate

    # for index, m in enumerate(data.milestones):
    #     if m.endDate < m.startDate:
    #         raise HTTPException(
    #             status_code=400,
    #             detail=f"Milestone {index + 1} endDate must be after startDate"
    #         )

    #     if m.startDate < previous_end:
    #         raise HTTPException(
    #             status_code=400,
    #             detail=f"Milestone {index + 1} overlaps with previous milestone"
    #         )

    #     if m.endDate > data.endDate:
    #         raise HTTPException(
    #             status_code=400,
    #             detail=f"Milestone {index + 1} exceeds goal endDate"
    #         )

    #     previous_end = m.endDate

    # ------------------ DOCUMENT ------------------
    now = datetime.utcnow()

    goal_doc = {
        "userId": str(current_user["_id"]),
        "title": data.title,
        "description": data.description,
        "startDate": data.startDate,
        "endDate": data.endDate,
        "milestones": [
            {
                "title": m.title,
                "description": m.description,
                "startDate": m.startDate,
                "endDate": m.endDate,
                "completed": False,
            }
            for m in data.milestones
        ],
        "createdAt": now,
        "updatedAt": now,
    }

    result = await db.insert_one(goal_doc)

    # ------------------ RESPONSE ------------------
    return {
        "success": True
    }


from bson import ObjectId

@router.get("/projects/goal_achiever/goals")
async def get_all_goals(
    current_user: dict = Depends(get_current_user)
):
    db = mongodb.db.goals

    goals_cursor = db.find(
        {"userId": str(current_user["_id"])}
    ).sort("createdAt", -1)

    goals = []

    async for goal in goals_cursor:
        status = get_goal_status(goal)
        goals.append({
            "id": str(goal["_id"]),
            "title": goal["title"],
            "description": goal["description"],
            "startDate": goal["startDate"].isoformat(),
            "endDate": goal["endDate"].isoformat(),"status": status,
            "milestones": [
                {
                    "title": m["title"],
                    "description": m["description"],
                    "startDate": m["startDate"].isoformat(),
                    "endDate": m["endDate"].isoformat(),
                    "completed": m.get("completed", False),
                }
                for m in goal.get("milestones", [])
            ],
            "createdAt": goal["createdAt"].isoformat(),
        })
        

    return {
        "success": True,
        "goals": goals
    }
from fastapi import Body

@router.patch("/projects/goal_achiever/goals/{goal_id}/milestones/{index}/toggle")
async def toggle_milestone(
    goal_id: str,
    index: int,
    current_user: dict = Depends(get_current_user)
):
    db = mongodb.db.goals

    goal = await db.find_one({
        "_id": ObjectId(goal_id),
        "userId": str(current_user["_id"])
    })

    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    try:
        milestone = goal["milestones"][index]
    except IndexError:
        raise HTTPException(status_code=404, detail="Milestone not found")

    new_status = not milestone.get("completed", False)

    await db.update_one(
        {"_id": ObjectId(goal_id)},
        {
            "$set": {
                f"milestones.{index}.completed": new_status,
                "updatedAt": datetime.utcnow()
            }
        }
    )

    return {
        "success": True,
        "completed": new_status
    }
def get_goal_status(goal):
    milestones = goal.get("milestones", [])
    if not milestones:
        return "pending"

    if all(m.get("completed") for m in milestones):
        return "completed"

    if any(m.get("completed") for m in milestones):
        return "in-progress"

    return "pending"


from bson import ObjectId

@router.delete("/projects/goal_achiever/goals/{goal_id}")
async def delete_goal(
    goal_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = mongodb.db.goals

    try:
        oid = ObjectId(goal_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid goal ID")

    result = await db.delete_one({
        "_id": oid,
        "userId": str(current_user["_id"])  # 🔐 ownership check
    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Goal not found or not authorized"
        )

    return {
        "success": True,
        "message": "Goal deleted successfully"
    }

import os
import json
import re
from datetime import date
from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_groq import ChatGroq

# ---------------- Config ----------------

GROQ_API = os.getenv("GROQ_API")
if not GROQ_API:
    raise RuntimeError("GROQ_API environment variable not set")

TEMPERATURE = 0.4

# ---------------- Schemas ----------------

class AISuggestRequest(BaseModel):
    title: str
    description: str
    startDate: date
    endDate: date


class MilestoneResponse(BaseModel):
    title: str
    description: str
    startDate: date
    endDate: date


class AISuggestResponse(BaseModel):
    milestones: List[MilestoneResponse]

# ---------------- Route ----------------

@router.post(
    "/projects/goal_achiever/ai_suggest_milestones",
    response_model=AISuggestResponse,
)
async def ai_suggest_milestones(payload: AISuggestRequest):
    if payload.endDate <= payload.startDate:
        raise HTTPException(
            status_code=400,
            detail="End date must be after start date",
        )

    prompt = f"""
Create milestone steps for the following goal.

Goal Title: {payload.title}
Description: {payload.description}
Start Date: {payload.startDate}
End Date: {payload.endDate}

Rules:
- Full details in multiple milestones step by step you can search resources on web also
like syllabus etc needed
- Chronological order
- Dates must stay within the goal range
- Each milestone must have:
  - title
  - description
  - startDate
  - endDate
as detail and step as possible.

Return ONLY valid JSON in this format:
{{
  "milestones": [
    {{
      "title": "",
      "description": "",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD"
    }}
  ]
}}
"""

    llm = ChatGroq(
        model="openai/gpt-oss-120b",
        temperature=TEMPERATURE,
        api_key=GROQ_API,
    )

    response = llm.invoke(prompt)

    # ---------------- Parse AI Output ----------------
    try:
        content = response.content.strip()

        # Remove ```json ``` or ``` wrappers
        content = re.sub(r"^```json|```$", "", content, flags=re.MULTILINE).strip()

        parsed = json.loads(content)
        milestones = parsed.get("milestones")

        if not milestones or not isinstance(milestones, list):
            raise ValueError("Invalid milestone format")

        # Validate milestone date ranges
        for m in milestones:
            if (
                m["startDate"] < str(payload.startDate)
                or m["endDate"] > str(payload.endDate)
                or m["endDate"] < m["startDate"]
            ):
                raise ValueError("Milestone dates out of range")

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse AI response: {str(e)}",
        )

    return {"milestones": milestones}
