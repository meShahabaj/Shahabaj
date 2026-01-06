
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
    if data.endDate < data.startDate:
        raise HTTPException(
            status_code=400,
            detail="Goal endDate must be after startDate"
        )

    if len(data.milestones) == 0:
        raise HTTPException(
            status_code=400,
            detail="At least one milestone is required"
        )

    # ------------------ MILESTONE VALIDATION ------------------
    previous_end = data.startDate

    for index, m in enumerate(data.milestones):
        if m.endDate < m.startDate:
            raise HTTPException(
                status_code=400,
                detail=f"Milestone {index + 1} endDate must be after startDate"
            )

        if m.startDate < previous_end:
            raise HTTPException(
                status_code=400,
                detail=f"Milestone {index + 1} overlaps with previous milestone"
            )

        if m.endDate > data.endDate:
            raise HTTPException(
                status_code=400,
                detail=f"Milestone {index + 1} exceeds goal endDate"
            )

        previous_end = m.endDate

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
