import os
import shutil
import tempfile
from contextlib import asynccontextmanager
from typing import Annotated

from dotenv import dotenv_values
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


from helpers import (
    generate_embedding_doc,
    get_text_from_pdf,
    run_rag_pipeline,
    split_doc_chunks,
)

# --------------------------------------------------
# CONFIG
# --------------------------------------------------

config = dotenv_values(".env")

GROQ_API_KEY = config.get(
    "GROQ_API_KEY",
    os.getenv("GROQ_API_KEY", "")
)

if not GROQ_API_KEY:
    raise RuntimeError("Missing GROQ_API_KEY")

# --------------------------------------------------
# SIMPLE LIST STORAGE: I Don't Use Chroma DB --> Deployment Causes
# --------------------------------------------------

chunked_documents = []

# --------------------------------------------------
# FASTAPI
# --------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("API Started")
    yield
    print("API Stopped")

app = FastAPI(
    title="Simple RAG API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# SCHEMAS
# --------------------------------------------------

class QueryRequest(BaseModel):
    question: str
    top_k: int = 5
    rerank_top_k: int = 3

# --------------------------------------------------
# ROUTES
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "RAG API Running"
    }

# --------------------------------------------------
# UPLOAD PDF
# --------------------------------------------------

@app.post("/upload-pdf")
async def upload_pdf(
    file: Annotated[
        UploadFile,
        File(description="PDF file")
    ],
):
    print("FILE SEND: ", file)

    global chunked_documents

    # -------------------------------
    # CHECK PDF
    # -------------------------------

    if not file.filename.endswith(".pdf"):

        raise HTTPException(
            status_code=400,
            detail="Only PDF allowed"
        )

    # -------------------------------
    # SAVE TEMP PDF
    # -------------------------------

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    ) as tmp:

        shutil.copyfileobj(file.file, tmp)

        tmp_path = tmp.name

    try:

        # -------------------------------
        # EXTRACT TEXT
        # -------------------------------

        documents = get_text_from_pdf(tmp_path)

        if not documents:

            raise HTTPException(
                status_code=400,
                detail="No text found"
            )

        # -------------------------------
        # CHUNKING
        # -------------------------------

        chunked_documents = split_doc_chunks(
            documents
        )

        # -------------------------------
        # GENERATE EMBEDDINGS
        # -------------------------------

        chunked_documents = generate_embedding_doc(
            chunked_documents
        )

        return {
            "message": "PDF indexed successfully",
            "chunks": len(chunked_documents)
        }

    finally:

        os.unlink(tmp_path)

# --------------------------------------------------
# QUERY
# --------------------------------------------------

@app.post("/query")
def query(req: QueryRequest):

    global chunked_documents
    print("Question", req)

    if not chunked_documents:

        raise HTTPException(
            status_code=400,
            detail="Upload PDF first"
        )

    answer = run_rag_pipeline(
        question=req.question,
        chunked_documents=chunked_documents,
        groq_api_key=GROQ_API_KEY,
        top_k=req.top_k,
        rerank_top_k=req.rerank_top_k,
    )

    return {
        "question": req.question,
        "answer": answer,
    }


