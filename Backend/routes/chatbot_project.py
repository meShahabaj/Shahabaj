from flask import Blueprint, request
from langchain_groq import ChatGroq
import json
import os

chatbot_project_bp = Blueprint("/chatbot/user_request", __name__)

GROQ_API = os.getenv("GROQ_API")
temperature = .9

@chatbot_project_bp.route("/chatbot/user_request", methods=["POST"])
def chat():
    # loading data
    raw_data = request.data 
    data = json.loads(raw_data.decode("utf-8"))['text']

    # model
    llm = ChatGroq(
        model = "openai/gpt-oss-120b",
        temperature=temperature,
        api_key=GROQ_API
    )
    
    messages = [
        {"role": "user", "content": data}, 
        {"role": "system", "content":"You are helpful assistant"}
    ]

    response = llm.invoke(messages)
    return response.content
