from pydantic import BaseModel
from typing import List

class TemplateVariable(BaseModel):
    key: str
    label: str
    description: str
    example: str
    required: bool

class TemplateCreate(BaseModel):
    id: str
    title: str
    body_md: str
    variables: List[TemplateVariable]