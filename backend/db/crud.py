from sqlalchemy.orm import Session
from db import models
from templating.schema import TemplateSchema


def save_template(db: Session, template: TemplateSchema):
    db_template = models.Template(
        template_id=template.template_id,
        title=template.title,
        doc_type=template.doc_type,
        jurisdiction=template.jurisdiction,
        similarity_tags=template.similarity_tags,
        body_md=template.body_md,
    )

    db.add(db_template)

    for var in template.variables:
        db_var = models.TemplateVariable(
            template_id=template.template_id,
            key=var.key,
            label=var.label,
            description=var.description,
            example=var.example,
            required=var.required,
            dtype=var.dtype,
            regex=var.regex,
            enum=var.enum,
        )
        db.add(db_var)

    db.commit()
