import onnxruntime as ort
from transformers import AutoTokenizer
import numpy as np
import faiss
import psutil
import os

# --- RAM helper ---
def print_ram(msg=""):
    process = psutil.Process(os.getpid())
    ram_in_mb = process.memory_info().rss / (1024 ** 2)
    print(f"{msg} RAM usage: {ram_in_mb:.2f} MB")

# --- Load tokenizer and ONNX model ---
onnx_model_path = "./Utils/model_quint8_avx2.onnx"
tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
ort_session = ort.InferenceSession(onnx_model_path)

print_ram("After loading ONNX model")

# --- Function to get embeddings ---
def get_embeddings(texts, batch_size=32):
    all_embeddings = []
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i:i+batch_size]
        inputs = tokenizer(batch_texts, padding=True, truncation=True, return_tensors="np")
        ort_inputs = {k: v for k, v in inputs.items()}
        emb = ort_session.run(None, ort_inputs)[0]
        all_embeddings.append(emb.astype("float32"))  # FAISS works with float32
    return np.vstack(all_embeddings)

# --- Load texts ---
with open("about_me.txt", "r", encoding="utf-8") as f:
    texts = f.read()
    texts = [t.strip() for t in texts.split("\n\n") if t.strip()]

print(f"Loaded {len(texts)} text chunks")

# --- Compute embeddings ---
embeddings = get_embeddings(texts, batch_size=16)
embeddings = embeddings.mean(axis=1)
print_ram("After computing embeddings")
print("Embeddings shape:", embeddings.shape)


# --- Create FAISS index ---
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(embeddings)
faiss.write_index(index, "./Utils/faiss.index")
np.save("./Utils/texts.npy", np.array(texts))

print_ram("After saving FAISS index")
print("FAISS index and texts saved successfully ✅")
