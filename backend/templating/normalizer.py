import re
from typing import List, Dict
from .schema import TemplateVariable


def to_snake_case(text: str) -> str:
    text = re.sub(r"[^\w\s]", "", text)
    text = text.strip().lower()
    return re.sub(r"\s+", "_", text)


def normalize_variables(raw_vars: List[Dict]) -> List[TemplateVariable]:
    seen_keys = set()
    normalized = []

    for var in raw_vars:
        key = to_snake_case(var["key"])

        if key in seen_keys:
            continue

        seen_keys.add(key)

        normalized.append(
            TemplateVariable(
                key=key,
                label=var.get("label", key.replace("_", " ").title()),
                description=var.get("description", ""),
                example=var.get("example"),
                required=var.get("required", True),
                dtype=var.get("dtype", "string"),
                regex=var.get("regex"),
                enum=var.get("enum"),
            )
        )

    return normalized
