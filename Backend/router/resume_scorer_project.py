from fastapi import APIRouter, UploadFile, File, Form
import onnxruntime as ort
from transformers import AutoTokenizer
import numpy as np
from PyPDF2 import PdfReader
import io
import re

tokenizer = None
ort_session = None

router = APIRouter()

def ensure_loaded():
    global tokenizer, ort_session
    if tokenizer is None or ort_session is None:
        tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
        ort_session = ort.InferenceSession("./Utils/model_quint8_avx2.onnx")

# --- Embedding function ---
def get_embeddings(texts_list):
    inputs = tokenizer(texts_list, padding=True, truncation=True, return_tensors="np")
    ort_inputs = {k: v for k, v in inputs.items()}
    embeddings = ort_session.run(None, ort_inputs)[0]
    embeddings = embeddings.mean(axis=1).astype("float32")
    return embeddings

def similarity_score(text_emb, job_emb):
    text_emb = np.array(text_emb).flatten()
    job_emb = np.array(job_emb).flatten()
    return float(np.dot(text_emb, job_emb) / (np.linalg.norm(text_emb) * np.linalg.norm(job_emb)))

# -------- Issue Checker ----------
def check_issues(num_pg, text_pages, text):
    issues = []

    if num_pg > 2:
        issues.append({
            "name": "Resume is more than 2 pages.",
            "severity": "High",
            "detail": f"Detected {num_pg} pages."
        })

    empty_pages = sum(1 for p in text_pages if len(p.strip()) < 20)
    if empty_pages > 0:
        issues.append({
            "name": "Some pages contain very little content.",
            "severity": "Medium",
            "detail": f"{empty_pages} nearly empty page(s)."
        })

    if len(text.split()) < 200:
        issues.append({
            "name": "Resume may be too short.",
            "severity": "Medium",
            "detail": f"Detected {len(text.split())} words."
        })

    return issues


# -------- SECTION CLASSIFICATION ----------
SECTION_LABELS = [
    "skills: This section lists technical skills, tools, programming languages, and competencies.",
]

def classify_paragraphs(paragraphs):
    ensure_loaded()
    label_emb = get_embeddings(SECTION_LABELS)
    para_emb = get_embeddings(paragraphs)

    result = {label: [] for label in SECTION_LABELS}

    for i, emb in enumerate(para_emb):
        sims = [
            similarity_score(emb, label_emb[j])
            for j in range(len(SECTION_LABELS))
        ]
        best_idx = int(np.argmax(sims))
        result[SECTION_LABELS[best_idx]].append(paragraphs[i])

    return result


# -------- MAIN ENDPOINT ----------
@router.post("/projects/resume_scorer")
async def resume_scorer(
    file: UploadFile = File(...),
    JobTitle: str = Form(...)
):
    contents = await file.read()

    if file.content_type != "application/pdf":
        return {"error": "Only PDF files are supported."}

    pdf = PdfReader(io.BytesIO(contents))

    num_pg = len(pdf.pages)

    text_pages = []
    for page in pdf.pages:
        extracted = page.extract_text() or ""
        text_pages.append(extracted)

    text = "\n".join(text_pages)

    ensure_loaded()

    text_emb = get_embeddings([text])
    job_emb = get_embeddings([JobTitle])

    similarity = similarity_score(text_emb, job_emb) * 100

    issues = check_issues(num_pg, text_pages, text)

    # --- Section extraction ---
    # paragraphs = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 0]

    # sections = classify_paragraphs(paragraphs)

    # print(sections)

    return {
        "Similarity score": round(similarity, 2),
        # "Pages": num_pg,
        "Issues": issues,
        # "Sections": sections
    }
