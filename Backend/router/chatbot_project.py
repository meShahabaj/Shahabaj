from fastapi import APIRouter
from pydantic import BaseModel
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os
import onnxruntime as ort
from transformers import AutoTokenizer
import numpy as np
import faiss
import psutil

load_dotenv()
router = APIRouter()

GROQ_API = os.getenv("GROQ_API")
temperature = 0.7

# --- Globals ---
tokenizer = None
ort_session = None
faiss_index = None
texts = None

def print_ram(msg=""):
    process = psutil.Process(os.getpid())
    ram_in_mb = process.memory_info().rss / (1024 ** 2)
    print(f"{msg} RAM usage: {ram_in_mb:.2f} MB")

def ensure_loaded():
    global tokenizer, ort_session, faiss_index, texts
    if tokenizer is None or ort_session is None:
        print("Loading ONNX model and tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
        ort_session = ort.InferenceSession("./Utils/model_quint8_avx2.onnx")  # path to your ONNX model
        print_ram("After loading ONNX model")
    if faiss_index is None:
        print("Loading FAISS index...")
        faiss_index = faiss.read_index("./Utils/faiss.index", faiss.IO_FLAG_MMAP)
    if texts is None:
        print("Loading texts...")
        texts = np.load("./Utils/texts.npy", allow_pickle=True)

class UserRequest(BaseModel):
    text: str

# --- Function to get embeddings from ONNX model ---
def get_embeddings(texts_list):
    inputs = tokenizer(texts_list, padding=True, truncation=True, return_tensors="np")
    ort_inputs = {k: v for k, v in inputs.items()}
    embeddings = ort_session.run(None, ort_inputs)[0]  # shape: (batch, seq_len, hidden)
    # Mean pooling over sequence
    embeddings = embeddings.mean(axis=1).astype("float32")
    return embeddings

def retrieve_context(query: str):
    ensure_loaded()
    q_emb = get_embeddings([query])
    D, I = faiss_index.search(q_emb, 1)
    
    context = texts[I[0][0]]
    # Mask personal info
    context = context.replace("Shahabaj Khan", "ADMIN_NAME")
    context = context.replace("Shahabaj", "ADMIN_NAME")

    print(context)
    return context

def chat_req(query, context):
    query_masked = query.replace("Shahabaj Khan", "ADMIN_NAME").replace("Shahabaj", "ADMIN_NAME")
    
    llm = ChatGroq(
        model="openai/gpt-oss-120b",
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
    answer = response.content.replace("ADMIN_NAME", "Shahabaj Khan").replace("ADMIN_NAME", "Shahabaj")
    return answer

@router.post("/chatbot/user_request")
async def chat(req: UserRequest):
    user_msg = req.text
    print(f"User query: {user_msg}")
    
    context = retrieve_context(user_msg)
    answer = chat_req(user_msg, context)
    
    print(f"Answer: {answer}")
    return answer
