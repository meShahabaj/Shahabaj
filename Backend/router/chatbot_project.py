from fastapi import APIRouter
from pydantic import BaseModel
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

load_dotenv()
router = APIRouter()

GROQ_API = os.getenv("GROQ_API")
temperature = 0.7

model = None
faiss_index = None
texts = None

def ensure_loaded():
    global model, faiss_index, texts
    if model is None:
        print("Loading model")
        model = SentenceTransformer("all-MiniLM-L6-v2")
    if faiss_index is None:
        print("Loading index")
        faiss_index = faiss.read_index("faiss.index", faiss.IO_FLAG_MMAP)
    if texts is None:
        print("Loading text")
        texts = np.load("texts.npy", allow_pickle=True)

class UserRequest(BaseModel):
    text: str

def retrieve_context(query: str):
    ensure_loaded()
    q_emb = model.encode([query]).astype("float16")
    D, I = faiss_index.search(q_emb, 1)    

    context = texts[I[0][0]]
    context = context.replace("Shahabaj Khan", "ADMIN_NAME")
    context = context.replace("Shahabaj", "ADMIN_NAME")

    print(context)
    return context

def chat_req(query, context):
    query = query.replace("Shahabaj Khan", "ADMIN_NAME")
    query = query.replace("Shahabaj", "ADMIN_NAME")
    llm = ChatGroq(
        model="openai/gpt-oss-120b",
        temperature=temperature,
        api_key=GROQ_API
    )

    messages = [
        {
            "role": "system",
            "content": (
                "You are a assistant of admin to help users on our website and know about admin. "
                "You are given a user question and retrieved context. "
                "Use the context to answer. "
                "Some info is masked for privacy."
                "Answer as short as possible."
                f"\n\nContext:\n{context}"
            )
        },
        {
            "role": "user",
            "content": query
        }
    ]

    response = llm.invoke(messages)
    response = response.content.replace("ADMIN_NAME", "Shahabaj Khan")
    response =response.replace("ADMIN_NAME", "Shahabaj")

    # unmask BEFORE returning to user
    return response

@router.post("/chatbot/user_request")
async def chat(req: UserRequest):
    user_msg = req.text
    print(req.text)
    context = retrieve_context(user_msg)
    
    answer = chat_req(user_msg, context)
    print(answer)


    return answer