from fastapi import APIRouter
from pydantic import BaseModel
from langchain_groq import ChatGroq
import os

router = APIRouter()

GROQ_API = os.getenv("GROQ_API")
temperature = 0.9

class UserRequest(BaseModel):
    text: str

@router.post("/chatbot/user_request")
async def chat(req: UserRequest):
    # message from user
    user_msg = req.text

    # model
    llm = ChatGroq(
        model="openai/gpt-oss-120b",
        temperature=temperature,
        api_key=GROQ_API
    )
    
    messages = [
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": user_msg},
    ]

    response = llm.invoke(messages)  # returns AIMessage
    return {"response": response.content}
