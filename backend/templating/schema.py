from typing import List, Optional
from pydantic import BaseModel, Field


class TemplateVariable(BaseModel):
    key: str
    label: str
    description: str
    example: Optional[str] = None
    required: bool = True
    dtype: str = "string"
    regex: Optional[str] = None
    enum: Optional[List[str]] = None


class TemplateSchema(BaseModel):
    template_id: str
    title: str
    file_description: str
    jurisdiction: str
    doc_type: str
    similarity_tags: List[str]
    variables: List[TemplateVariable]
    body_md: str
