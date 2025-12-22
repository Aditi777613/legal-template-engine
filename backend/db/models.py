from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.sql import func
from .database import Base


class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String, unique=True, index=True)
    title = Column(String)
    doc_type = Column(String)
    jurisdiction = Column(String)
    similarity_tags = Column(JSON)
    body_md = Column(Text)
    embedding = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class TemplateVariable(Base):
    __tablename__ = "template_variables"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String, ForeignKey("templates.template_id"))
    key = Column(String)
    label = Column(String)
    description = Column(Text)
    example = Column(String)
    required = Column(Boolean)
    dtype = Column(String)
    regex = Column(String)
    enum = Column(JSON)


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    mime = Column(String)
    raw_text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Instance(Base):
    __tablename__ = "instances"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String)
    user_query = Column(Text)
    answers_json = Column(JSON)
    draft_md = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
