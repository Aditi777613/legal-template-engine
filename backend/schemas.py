from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime


class DraftRequest(BaseModel):
    user_query: str


class TemplateMatch(BaseModel):
    template_id: str
    title: str
    confidence: float
    reason: str


class AnswerVarsRequest(BaseModel):
    template_id: str
    answers: Dict[str, str]


class DraftGenerateRequest(BaseModel):
    template_id: str


class DraftHistoryItem(BaseModel):
    instance_id: int
    template_id: str
    created_at: datetime


class WebBootstrapDoc(BaseModel):
    title: str
    url: str
    text: str


class WebBootstrapResponse(BaseModel):
    documents: List[WebBootstrapDoc]
