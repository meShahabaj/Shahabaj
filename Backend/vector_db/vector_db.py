from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer("paraphrase-MiniLM-L3-v2")

def main():
    with open('about_me.txt', 'r', encoding='utf-8') as f:
        texts = f.read()

    texts = texts.split("\n\n")

    emb = model.encode(texts).astype("float32")

    index = faiss.IndexFlatL2(emb.shape[1])
    index.add(emb)
    faiss.write_index(index, "faiss.index")
    np.save("texts.npy", np.array(texts))

def query():
    q = "hello"
    index = faiss.read_index("faiss.index")

    texts = np.load("texts.npy", allow_pickle=True)
    print("encoding start")
    q_emb = model.encode([q]).astype("float32")
    print("searching start")
    D, I = index.search(q_emb, 3)
    print([texts[i] for i in I[0]])

if __name__ == "__main__":
    main()
    query()
