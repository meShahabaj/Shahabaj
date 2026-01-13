from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_groq import ChatGroq
import os
import onnxruntime as ort
from transformers import AutoTokenizer
import numpy as np
import faiss

load_dotenv()
router = APIRouter()

GROQ_API = os.getenv("GROQ_API")
temperature = 0.8

# --- Globals ---
tokenizer = None
ort_session = None
faiss_index = None
texts = None

# ------------------ LOADING MODELS ---------------------
def ensure_loaded():
    global tokenizer, ort_session, faiss_index, texts
    if tokenizer is None or ort_session is None:
        tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
        ort_session = ort.InferenceSession("./Utils/model_quint8_avx2.onnx")  # path to your ONNX model
        
    if faiss_index is None:
        faiss_index = faiss.read_index("./Utils/faiss.index", faiss.IO_FLAG_MMAP)
    if texts is None:
        texts = np.load("./Utils/texts.npy", allow_pickle=True)

class UserRequest(BaseModel):
    text: str

# --- Get embeddings from ONNX model ---
def get_embeddings(texts_list):
    inputs = tokenizer(texts_list, padding=True, truncation=True, return_tensors="np")
    ort_inputs = {k: v for k, v in inputs.items()}
    embeddings = ort_session.run(None, ort_inputs)[0]  # shape: (batch, seq_len, hidden)
    embeddings = embeddings.mean(axis=1).astype("float32")
    return embeddings

# ---------- Finding Context ----------
def retrieve_context(query: str):
    ensure_loaded()
    q_emb = get_embeddings([query])
    D, I = faiss_index.search(q_emb, 1)
    
    context = texts[I[0][0]]

    return context

# ----------- Feeding to LLM ----------------
def chat_req(query, context):
    query_masked = query.replace("Shahabaj Khan", "ADMIN_NAME").replace("Shahabaj", "ADMIN_NAME")
    llm = ChatGroq(
        model="openai/gpt-oss-20b",
        temperature=temperature,
        api_key=GROQ_API
    )
    messages = [
        {
            "role": "system",
            "content": (
                "You are an assistant of admin to help users on our website and know about admin. "
                "You are given a user question and retrieved context. "
                "Use the context to answer. "
                "Some info is masked for privacy. "
                "Answer as short as possible."
                f"\n\nContext:\n{context}"
            )
        },
        {
            "role": "user",
            "content": query_masked
        }
    ]
    response = llm.invoke(messages)
    # Unmask before returning
    answer = response.content
    return answer

# ----------- ROUTE ------------------
@router.post("/chatbot/user_request")
async def chat(req: UserRequest):
    user_msg = req.text
    
    context = retrieve_context(user_msg)
    answer = chat_req(user_msg, context)
    
    return answer
