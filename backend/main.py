from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile

from gemini import extract_template_from_text
from templating.builder import build_template
from templating.cache import TEMPLATE_CACHE
from embeddings.embedder import generate_embedding
from retrieval.selector import select_templates
from qa.questions import generate_questions
from drafting.renderer import render_draft
from web_bootstrap.exa_client import search_legal_templates

from db.init_db import init_db
from db.database import SessionLocal
from db import models
from schemas import DraftRequest

app = FastAPI(title="Legal Template Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/draft/start")
def start_draft(req: DraftRequest, db: Session = Depends(get_db)):
    templates = db.query(models.Template).all()

    if templates:
        query_embedding = generate_embedding(req.user_query)

        matches = select_templates(
            user_query=req.user_query,
            query_embedding=query_embedding,
            templates=templates,
        )

        if matches and matches[0]["confidence"] >= 0.6:
            return {"matches": matches}

    return {
        "matches": [],
        "web_bootstrap": True,
        "message": "No suitable local template found",
    }


@app.post("/draft/web-bootstrap")
def web_bootstrap(req: DraftRequest):
    docs = search_legal_templates(req.user_query)

    return {
        "documents": docs
    }
