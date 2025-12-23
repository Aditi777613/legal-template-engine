import re
from typing import Dict

# UOIONHHC


def render_draft(body_md: str, answers: Dict[str, str]) -> str:
    rendered = body_md

    for key, value in answers.items():
        placeholder = r"\{\{\s*" + re.escape(key) + r"\s*\}\}"
        rendered = re.sub(
            placeholder,
            value,
            rendered,
            flags=re.IGNORECASE,
        )

    return rendered
