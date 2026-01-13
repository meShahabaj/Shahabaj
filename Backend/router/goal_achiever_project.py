from fastapi import APIRouter, Depends, HTTPException
from fastapi import Body, Query
from pydantic import BaseModel
from typing import List, Literal
from datetime import datetime, date
from bson import ObjectId
import os, json, re

from .goal_achiever_auth import get_current_user
from DB import mongodb
from langchain_groq import ChatGroq

# ---------------- Config ----------------
GROQ_API = os.getenv("GROQ_API")
if not GROQ_API:
    raise RuntimeError("GROQ_API environment variable not set")

TEMPERATURE = 0.4

router = APIRouter()


# ---------------- Schemas ----------------
class MilestoneBase(BaseModel):
    title: str
    description: str
    startDate: datetime
    endDate: datetime

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneResponse(BaseModel):
    title: str
    description: str
    startDate: date
    endDate: date

class GoalCreate(BaseModel):
    title: str
    description: str
    startDate: datetime
    endDate: datetime
    milestones: List[MilestoneCreate]
    hoursPerDay: int
    daysOfWeek: List[Literal["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]]

class AIQuestionRequest(BaseModel):
    title: str
    description: str
    startDate: datetime
    endDate: datetime
    hoursPerDay: int
    daysOfWeek: List[str]

class AISuggestRequest(BaseModel):
    title: str
    description: str
    startDate: date
    endDate: date
    hoursPerDay: int
    daysOfWeek: List[str]

class AISuggestResponse(BaseModel):
    milestones: List[MilestoneResponse]

class MemoryAnswer(BaseModel):
    userId: str
    category: str  # e.g., "education", "goal_preferences"
    question: str
    answer: str
    createdAt: datetime = datetime.utcnow()

class AnswerRequest(BaseModel):
    question: str
    answer: str


# ---------------- Utils ----------------
def get_goal_status(goal: dict) -> str:
    """Determine the status of a goal based on its milestones."""
    milestones = goal.get("milestones", [])
    if not milestones:
        return "pending"
    if all(m.get("completed") for m in milestones):
        return "completed"
    if any(m.get("completed") for m in milestones):
        return "in-progress"
    return "pending"

async def save_memory_answer(user_id: str, question: str, answer: str):
    """Save a user's memory answer in the database."""
    db = mongodb.db.memory
    doc = {
        "userId": user_id,
        "question": question,
        "answer": answer,
        "createdAt": datetime.utcnow(),
    }
    await db.insert_one(doc)


# ---------------- Goal CRUD ----------------
@router.post("/projects/goal_achiever/create_goal")
async def create_goal(data: GoalCreate, current_user: dict = Depends(get_current_user)):
    """Create a new goal with milestones."""
    db = mongodb.db.goals
    now = datetime.utcnow()
    goal_doc = {
        "userId": str(current_user["_id"]),
        "title": data.title,
        "description": data.description,
        "startDate": data.startDate,
        "endDate": data.endDate,
        "hoursPerDay": data.hoursPerDay,
        "daysOfWeek": data.daysOfWeek,
        "milestones": [
            {**m.dict(), "completed": False} for m in data.milestones
        ],
        "createdAt": now,
        "updatedAt": now,
    }
    await db.insert_one(goal_doc)
    return {"success": True}

@router.get("/projects/goal_achiever/goals")
async def get_all_goals(current_user: dict = Depends(get_current_user)):
    """Fetch all goals for the current user."""
    db = mongodb.db.goals
    goals_cursor = db.find({"userId": str(current_user["_id"])}).sort("createdAt", -1)
    goals = []
    async for goal in goals_cursor:
        goals.append({
            "id": str(goal["_id"]),
            "title": goal["title"],
            "description": goal["description"],
            "startDate": goal["startDate"].isoformat(),
            "endDate": goal["endDate"].isoformat(),
            "hoursPerDay": goal["hoursPerDay"],
            "daysOfWeek": goal["daysOfWeek"],
            "status": get_goal_status(goal),
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
    return {"success": True, "goals": goals}

@router.patch("/projects/goal_achiever/goals/{goal_id}/milestones/{index}/toggle")
async def toggle_milestone(goal_id: str, index: int, current_user: dict = Depends(get_current_user)):
    """Toggle completion status of a milestone."""
    db = mongodb.db.goals
    goal = await db.find_one({"_id": ObjectId(goal_id), "userId": str(current_user["_id"])})
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    try:
        milestone = goal["milestones"][index]
    except IndexError:
        raise HTTPException(status_code=404, detail="Milestone not found")
    new_status = not milestone.get("completed", False)
    await db.update_one(
        {"_id": ObjectId(goal_id)},
        {"$set": {f"milestones.{index}.completed": new_status, "updatedAt": datetime.utcnow()}}
    )
    return {"success": True, "completed": new_status}

@router.delete("/projects/goal_achiever/goals/{goal_id}")
async def delete_goal(goal_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a goal by ID, ensuring ownership."""
    db = mongodb.db.goals
    try:
        oid = ObjectId(goal_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid goal ID")
    result = await db.delete_one({"_id": oid, "userId": str(current_user["_id"])})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Goal not found or not authorized")
    return {"success": True, "message": "Goal deleted successfully"}


# ---------------- Memory / AI ----------------
@router.post("/projects/goal_achiever/save_answer")
async def save_answer(payload: AnswerRequest, current_user: dict = Depends(get_current_user)):
    """Save user's answer to a question."""
    await save_memory_answer(str(current_user["_id"]), payload.question, payload.answer)
    return {"success": True}

@router.get("/projects/goal_achiever/memories")
async def get_memories(current_user: dict = Depends(get_current_user)):
    """Fetch all memory answers for the current user."""
    db = mongodb.db.memory
    user_id = str(current_user["_id"])
    memories = []
    async for doc in db.find({"userId": user_id}).sort("createdAt", -1):
        memories.append({
            "_id": str(doc["_id"]),
            "question": doc["question"],
            "answer": doc["answer"],
            "createdAt": doc.get("createdAt").isoformat(),
        })
    return {"memories": memories}
from pydantic import BaseModel

class MemoryUpdate(BaseModel):
    question: str
    answer: str

@router.patch("/projects/goal_achiever/memories/{memory_id}")
async def update_memory(
    memory_id: str,
    payload: MemoryUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = mongodb.db.memory
    user_id = str(current_user["_id"])

    try:
        oid = ObjectId(memory_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid memory ID")

    result = await db.update_one(
        {"_id": oid, "userId": user_id},
        {
            "$set": {
                "question": payload.question,
                "answer": payload.answer,
                "updatedAt": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Memory not found")

    return {"success": True}

@router.delete("/projects/goal_achiever/memories/{memory_id}")
async def delete_memory(memory_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a specific memory for the current user."""
    db = mongodb.db.memory
    user_id = str(current_user["_id"])
    memory = await db.find_one({"_id": ObjectId(memory_id), "userId": user_id})
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    await db.delete_one({"_id": ObjectId(memory_id)})
    return {"message": "Memory deleted successfully"}


# ---------------- AI Routes ----------------
@router.post("/projects/goal_achiever/ai_suggest_milestones", response_model=AISuggestResponse)
async def ai_suggest_milestones(payload: AISuggestRequest, current_user: dict = Depends(get_current_user)):
    """Generate AI-suggested milestones for a goal."""
    if payload.endDate <= payload.startDate:
        raise HTTPException(status_code=400, detail="End date must be after start date")
    
    db = mongodb.db.memory
    user_id = str(current_user["_id"])

    # Fetch relevant memory answers
    memory_docs = []
    async for doc in db.find({"userId": user_id, "category": "goal_preferences"}):
        memory_docs.append(doc)
    memory_text = "\n".join([f"- {m['question']}: {m['answer']}" for m in memory_docs]) or "No previous preferences stored."

    # AI prompt
    prompt = f"""
Create milestone steps for the following goal using user's preferences.

Goal Title: {payload.title}
Description: {payload.description}
Start Date: {payload.startDate}
End Date: {payload.endDate}
Hours Per Day: {payload.hoursPerDay}
Days of Week: {', '.join(payload.daysOfWeek)}

User Preferences:
{memory_text}

Rules:
- Full details in multiple milestones step by step
- Chronological order
- Dates must stay within the goal range
- Each milestone must have title, description, startDate, endDate
- Make milestones personalized based on preferences

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
    llm = ChatGroq(model="openai/gpt-oss-120b", temperature=TEMPERATURE, api_key=GROQ_API)
    response = llm.invoke(prompt)

    try:
        content = re.sub(r"^```json|```$", "", response.content.strip(), flags=re.MULTILINE)
        parsed = json.loads(content)
        milestones = parsed.get("milestones")
        if not milestones or not isinstance(milestones, list):
            raise ValueError("Invalid milestone format")
        for m in milestones:
            if m["startDate"] < str(payload.startDate) or m["endDate"] > str(payload.endDate) or m["endDate"] < m["startDate"]:
                raise ValueError("Milestone dates out of range")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")
    
    return {"milestones": milestones}

@router.post("/projects/goal_achiever/ai_generate_questions")
async def ai_generate_questions_dynamic(payload: AIQuestionRequest, current_user: dict = Depends(get_current_user)):
    """Generate dynamic AI questions based on a goal and previously answered questions."""
    db = mongodb.db.memory
    user_id = str(current_user["_id"])

    existing_answers = []
    async for doc in db.find({"userId": user_id, "category": "goal_preferences"}):
        existing_answers.append(doc["question"])

    prompt = f"""
You are an AI assistant helping a user create a goal plan.

Goal Title: {payload.title}
Description: {payload.description}
Start Date: {payload.startDate}
End Date: {payload.endDate}
Hours Per Day: {payload.hoursPerDay}
Days of Week: {', '.join(payload.daysOfWeek)}

User has already answered these questions:
{', '.join(existing_answers) if existing_answers else 'None'}

Generate 3-5 important questions you need answers to in order to create personalized milestone steps.
Return ONLY a JSON array of strings, like ["Question 1", "Question 2"].
Do not repeat questions that are already answered.
"""
    llm = ChatGroq(model="openai/gpt-oss-120b", temperature=0.4, api_key=GROQ_API)
    response = llm.invoke(prompt)

    try:
        content = re.sub(r"^```json|```$", "", response.content.strip(), flags=re.MULTILINE)
        questions = json.loads(content)
        if not isinstance(questions, list):
            raise ValueError("Invalid question format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI questions: {str(e)}")

    return {"questions": questions}
