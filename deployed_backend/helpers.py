"""
helpers.py — RAG Pipeline utility functions
"""

import re
import os
import numpy as np
import pdfplumber
from rank_bm25 import BM25Okapi
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from groq import Groq

# ---------------------------------------------------------------------------
# Load Model for EMbedding From Hugging Face
# ---------------------------------------------------------------------------

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


# ---------------------------------------------------------------------------
# 1. This is Part of PDF Extraction 
# ---------------------------------------------------------------------------

def get_text_from_pdf(path: str) -> list[dict]:
    """
    Extract text from every page of a PDF.

    Returns
    -------
    list[dict]
        Each dict has ``{"id": int, "text": str}``.
    """
    documents = []
    with pdfplumber.open(path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                text = text.strip()
                # Fix soft line-breaks inside paragraphs
                text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)
                # Collapse multiple spaces / newlines
                text = re.sub(r'\s+', ' ', text)
                documents.append({"id": i, "text": text})
    return documents


# ---------------------------------------------------------------------------
# 2. Chunking: Means Create Chunks from PDF
# ---------------------------------------------------------------------------

def split_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 30) -> list[str]:
    """Split a string into overlapping fixed-size chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - chunk_overlap
    return chunks


def split_doc_chunks(documents: list[dict]) -> list[dict]:
    """
    Split every document into text chunks.

    Returns
    -------
    list[dict]
        Each dict has ``{"id": str, "text": str}``.
    """
    chunked = []
    for doc in documents:
        for i, chunk in enumerate(split_text(doc["text"])):
            chunked.append({"id": f"{doc['id']}_chunk{i + 1}", "text": chunk})
    return chunked


# ---------------------------------------------------------------------------
# 3. Embeddings: Using The Model We Create Vector for Each Chunks
# ---------------------------------------------------------------------------

def get_embedding(text: str) -> np.ndarray:
    """Return the 384-dim embedding vector for *text*."""
    return embedding_model.encode(text)


def generate_embedding_doc(chunked_documents: list[dict]) -> list[dict]:
    """Attach an ``"embeddings"`` key to every chunk dict (in-place + return)."""
    for chunk in chunked_documents:
        chunk["embeddings"] = get_embedding(chunk["text"])
    return chunked_documents



# ---------------------------------------------------------------------------
# 5. HyDE  (Hypothetical Document Embeddings via Groq): Create Another Documents Using GROQ API (Better THen Gemini [By Experience])
# ---------------------------------------------------------------------------

def get_llm_documents(question: str, groq_api_key: str) -> str:
    """
    Ask the LLM to write a short hypothetical documentation passage that
    would answer *question*. Used for HyDE retrieval.
    """
    client = Groq(api_key=groq_api_key)
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": (
                    f"You are a technical documentation writer. "
                    f"Write one clear, structured documentation for: {question}. "
                    f"Use simple English words, be brief, and stay on topic."
                ),
            }
        ],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=True,
    )
    chunks = [c.choices[0].delta.content for c in completion]
    return "".join(s for s in chunks if s)


def split_text_llm(text: str) -> list[dict]:
    """Split LLM output by newline, keeping substantive paragraphs (>50 chars)."""
    chunks = []
    for i, paragraph in enumerate(text.split("\n")):
        paragraph = paragraph.strip()
        if len(paragraph) > 50:
            chunks.append({"id": f"chunk_{i}", "text": paragraph, "embedding": None})
    return chunks


def get_llm_embedding(response: str) -> list[dict]:
    """Split and embed an LLM-generated response."""
    llm_docs = split_text_llm(response)
    for doc in llm_docs:
        doc["embeddings"] = get_embedding(doc["text"])
    return llm_docs


# ---------------------------------------------------------------------------
# 6. Hybrid Search (BM25 + Embedding Similarity): Apply The Sementaic Search and KeyWord Search 
# ---------------------------------------------------------------------------

def hybrid_search(
    question: str,
    chunked_documents: list[dict],
    top_k: int = 5,
    k_rrf: int = 60,
) -> list[dict]:

    # ---------------------------------------------------
    # BM25 SEARCH: KeyWord Search
    # ---------------------------------------------------

    corpus = [doc["text"].split() for doc in chunked_documents]

    bm25 = BM25Okapi(corpus)

    bm25_scores = bm25.get_scores(question.split())

    bm25_ranked = sorted(
        range(len(bm25_scores)),
        key=lambda i: bm25_scores[i],
        reverse=True
    )

    # ---------------------------------------------------
    # EMBEDDING SEARCH
    # ---------------------------------------------------

    question_embedding = get_embedding(question)

    embedding_scores = []

    for idx, doc in enumerate(chunked_documents):

        score = cosine_similarity(
            [question_embedding],
            [doc["embeddings"]]
        )[0][0]

        embedding_scores.append((idx, score))

    embedding_ranked = sorted(
        embedding_scores,
        key=lambda x: x[1],
        reverse=True
    )

    # ---------------------------------------------------
    # RRF FUSION
    # ---------------------------------------------------

    rrf_scores = {}

    # BM25 contribution
    for rank, idx in enumerate(bm25_ranked[:top_k]):

        doc_id = chunked_documents[idx]["id"]

        rrf_scores[doc_id] = (
            rrf_scores.get(doc_id, 0)
            + 1 / (k_rrf + rank + 1)
        )

    # Embedding contribution
    for rank, (idx, _) in enumerate(embedding_ranked[:top_k]):

        doc_id = chunked_documents[idx]["id"]

        rrf_scores[doc_id] = (
            rrf_scores.get(doc_id, 0)
            + 1 / (k_rrf + rank + 1)
        )

    # ---------------------------------------------------
    # FINAL RANKING
    # ---------------------------------------------------

    sorted_ids = sorted(
        rrf_scores,
        key=rrf_scores.get,
        reverse=True
    )[:top_k]

    id_to_chunk = {
        doc["id"]: doc
        for doc in chunked_documents
    }

    return [
        id_to_chunk[doc_id]
        for doc_id in sorted_ids
        if doc_id in id_to_chunk
    ]

# ---------------------------------------------------------------------------
# 7. Re-ranking with HyDE embeddings
# ---------------------------------------------------------------------------

def rerank_with_hyde(
    hyde_embeddings: list[dict],
    hybrid_chunks: list[dict],
    top_k: int = 3,
) -> list[dict]:
    """
    Score each hybrid chunk against all HyDE vectors (cosine similarity).
    Returns the *top_k* chunks sorted by best cosine score.
    """
    hyde_vecs = np.array([doc["embeddings"] for doc in hyde_embeddings])
    results = []
    for chunk in hybrid_chunks:
        chunk_vec = np.array(chunk["embeddings"]).reshape(1, -1)
        scores = cosine_similarity(chunk_vec, hyde_vecs)
        results.append({"text": chunk["text"], "score": float(scores.max())})
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_k]


# ---------------------------------------------------------------------------
# 8. Context assembly
# ---------------------------------------------------------------------------

def get_context_from_chunks(relevant_chunks: list[dict]) -> str:
    """Join the text of all relevant chunks into one context string."""
    return " ".join(c["text"] for c in relevant_chunks)


# ---------------------------------------------------------------------------
# 9. Final answer generation
# ---------------------------------------------------------------------------

def generate_response(question: str, context: str, groq_api_key: str) -> str:
    """
        Generate a concise answer to *question* grounded in *context*.
        Uses Groq / LLaMA 3.1-8b-instant.
    """
    sys_prompt = f"""
        You are an assistant for question-answering tasks. Use the following pieces of
        retrieved context to answer the question. If you don't know the answer, say that you
        don't know. Use three sentences maximum and keep the answer concise.

        Instructions:
        - Be helpful and answer questions concisely. If you don't know the answer, say 'I don't know'.
        - Utilize the context provided for accurate and specific information.
        - Incorporate your preexisting knowledge to enhance the depth and relevance of your response.
        - Cite your sources.

        Context: {context}
    """
    client = Groq(api_key=groq_api_key)
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": sys_prompt},
            {"role": "user", "content": question},
        ],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=True,
    )
    res = [c.choices[0].delta.content for c in completion]
    return "".join(s for s in res if s)



# ---------------------------------------------------------------------------
# 10. End-to-end RAG pipeline
# ---------------------------------------------------------------------------

def run_rag_pipeline(
    question: str,
    chunked_documents: list[dict],
    groq_api_key: str,
    top_k: int = 5,
    rerank_top_k: int = 3,
) -> str:

    # ---------------------------------------------------
    # STEP 1 — HyDE
    # ---------------------------------------------------

    hyde_doc = get_llm_documents(
        question,
        groq_api_key
    )

    hyde_embeddings = get_llm_embedding(
        hyde_doc
    )

    # ---------------------------------------------------
    # STEP 2 — Hybrid Retrieval
    # ---------------------------------------------------

    hybrid_chunks = hybrid_search(
        question=question,
        chunked_documents=chunked_documents,
        top_k=top_k,
    )

    # ---------------------------------------------------
    # STEP 3 — Re-rank
    # ---------------------------------------------------

    top_chunks = rerank_with_hyde(
        hyde_embeddings=hyde_embeddings,
        hybrid_chunks=hybrid_chunks,
        top_k=rerank_top_k,
    )

    # ---------------------------------------------------
    # STEP 4 — Build Context
    # ---------------------------------------------------

    context = get_context_from_chunks(
        top_chunks
    )

    # ---------------------------------------------------
    # STEP 5 — Final Generation
    # ---------------------------------------------------

    response = generate_response(
        question=question,
        context=context,
        groq_api_key=groq_api_key,
    )

    return response
