from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

load_dotenv()
model = SentenceTransformer("paraphrase-MiniLM-L3-v2")

GROQ_API = os.getenv("GROQ_API")
temperature = 0.9

def chat_req(query, context):

    # model
    llm = ChatGroq(
        model="openai/gpt-oss-120b",
        temperature=temperature,
        api_key=GROQ_API
    )

    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful assistant of admin. "
                "You are given a user question and related context retrieved from a vector database. "
                "Use the context to answer the user question accurately. Some information is masked so dont be confused."
                f"\n\nContext:\n{context}"
            )
        },
        {
            "role": "user",
            "content": query
        }
    ]

    response = llm.invoke(messages)  
    print(response)
    return  response.content


def main():
    with open('about_me.txt', 'r', encoding='utf-8') as f:
        texts = f.read()

    texts = [t.strip() for t in texts.split("\n") if t.strip()]

    emb = model.encode(texts).astype("float32")

    index = faiss.IndexFlatL2(emb.shape[1])
    index.add(emb)
    faiss.write_index(index, "faiss.index")
    np.save("texts.npy", np.array(texts))

def query():
    index = faiss.read_index("faiss.index")
    texts = np.load("texts.npy", allow_pickle=True)

    while True:
        query = input("Enter your query: ")
        if query=="1":
            break

        q_emb = model.encode([query]).astype("float32")
        
        D, I = index.search(q_emb, 1)
        ret_data = [texts[i] for i in I[0]]
        ret_data = ret_data[0]
        ret_data = ret_data.replace("Shahabaj Khan", "ADMIN_NAME")
        
        response = chat_req(query, ret_data)
        response = response.replace("ADMIN_NAME", "Shahabaj Khan")

        print(response)