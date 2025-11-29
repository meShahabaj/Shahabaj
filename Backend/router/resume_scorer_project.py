from fastapi import APIRouter, UploadFile, File, Form
import onnxruntime as ort
from transformers import AutoTokenizer
import numpy as np

tokenizer = None
ort_session = None

router = APIRouter()

def ensure_loaded():
    global tokenizer, ort_session
    if tokenizer is None or ort_session is None:
        tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
        ort_session = ort.InferenceSession("./Utils/model_quint8_avx2.onnx")  # path to your ONNX model
        
# --- Get embeddings from ONNX model ---
def get_embeddings(texts_list):
    inputs = tokenizer(texts_list, padding=True, truncation=True, return_tensors="np")
    ort_inputs = {k: v for k, v in inputs.items()}
    embeddings = ort_session.run(None, ort_inputs)[0]  # shape: (batch, seq_len, hidden)
    embeddings = embeddings.mean(axis=1).astype("float32")
    return embeddings

def similarity_score(text_emb, job_emb):
    text_emb = np.array(text_emb).flatten()
    job_emb = np.array(job_emb).flatten()

    similarity = np.dot(text_emb, job_emb) / (np.linalg.norm(text_emb) * np.linalg.norm(job_emb))
    return float(similarity)

@router.post("/projects/resume_scorer")
async def resume_scorer(
    file: UploadFile = File(...),
    JobTitle: str = Form(...)
):
    contents = await file.read()

    if file.content_type == "application/pdf":
        import io
        from PyPDF2 import PdfReader
        pdf = PdfReader(io.BytesIO(contents))

        text = "\n".join([page.extract_text() for page in pdf.pages])

        ensure_loaded()

        text_emb = get_embeddings([text])
        job_emb = get_embeddings(JobTitle)


        similarity = similarity_score(text_emb, job_emb)

        
    return similarity * 100