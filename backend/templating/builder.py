import uuid
import yaml
from typing import Dict
from datetime import datetime

from .schema import TemplateSchema
from .normalizer import normalize_variables
from .replacer import replace_values_with_variables
from templating.cache import TEMPLATE_CACHE


def build_template(
    *,
    raw_text: str,
    extracted_json: Dict,
    filename: str
) -> TemplateSchema:
    raw_vars = extracted_json.get("variables", [])
    variables = normalize_variables(raw_vars)

    value_map = {}
    for var in variables:
        if var.example:
            value_map[var.example] = f"{{{{{var.key}}}}}"

    body_md = replace_values_with_variables(raw_text, value_map)

    template_id = f"tpl_{uuid.uuid4().hex[:10]}"
    title = extracted_json.get("title", filename.replace(".docx", ""))
    tags = extracted_json.get("similarity_tags", [])

    front_matter = {
        "template_id": template_id,
        "title": title,
        "file_description": f"Template generated from {filename}",
        "jurisdiction": extracted_json.get("jurisdiction", "IN"),
        "doc_type": extracted_json.get("doc_type", "legal_document"),
        "similarity_tags": tags,
        "variables": [v.model_dump() for v in variables],
        "watermark": "UOIONHHC",
        "created_at": datetime.utcnow().isoformat()
    }

    yaml_block = yaml.safe_dump(front_matter, sort_keys=False)

    full_md = (
        f"---\n{yaml_block}---\n\n"
        f"<!-- UOIONHHC -->\n\n"
        f"{body_md}"
    )

    schema = TemplateSchema(
        template_id=template_id,
        title=title,
        file_description=front_matter["file_description"],
        jurisdiction=front_matter["jurisdiction"],
        doc_type=front_matter["doc_type"],
        similarity_tags=tags,
        variables=variables,
        body_md=full_md
    )

    TEMPLATE_CACHE[template_id] = {
        "template": schema,
        "answers": {}
    }

    return schema
