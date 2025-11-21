from flask import Blueprint
from langchain_groq import ChatGroq
import json

chatbot_project_bp = Blueprint("/chatbot/user_request", __name__)

@chatbot_project_bp.route("/chatbot/user_request", methods=["POST"])
def chat():
    raw_data = request.data 
    data = json.loads(raw_data.decode("utf-8"))['text']

    llm = ChatGroq(
        model = "openai/gpt-oss-20b",
        temperature=.9,
        api_key=GROQ_API
    )
    messages = [
        {"role": "user", "content": data}, 
        {"role": "system", "content":"You are helpful assistant"}
    ]
    response = llm.invoke(messages)
    return response.content
