# from chat_imports import model, faiss_index, texts
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")
def main(): 
    with open('about_me.txt', 'r', encoding='utf-8') as f: 
        texts = f.read() 
        texts = [t.strip() for t in texts.split("\n\n") if t.strip()] 
        emb = model.encode(texts).astype("float16") 
        index = faiss.IndexFlatL2(emb.shape[1]) 
        index.add(emb) 
        faiss.write_index(index, "faiss.index") 
        np.save("texts.npy", np.array(texts))

if __name__=="__main__":
    main()