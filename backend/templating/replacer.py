import re
from typing import Dict


def replace_values_with_variables(text: str, value_map: Dict[str, str]) -> str:
    """
    value_map = {
        "Rajesh Kumar": "{{claimant_full_name}}",
        "15 July 2025": "{{date}}"
    }
    """

    updated_text = text

    for literal, placeholder in value_map.items():
        if not literal:
            continue

        escaped = re.escape(literal)
        updated_text = re.sub(
            escaped,
            placeholder,
            updated_text,
            flags=re.IGNORECASE
        )

    return updated_text
