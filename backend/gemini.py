from google import genai
import json
import re

client = genai.Client(
    vertexai=True,
    project="legal-template-engine",
    location="us-central1",
)

MODEL = "gemini-2.0-flash-001"


def extract_template_from_text(text: str) -> dict:
    system_prompt = """
You are a legal document templating assistant.

STRICT RULES (DO NOT VIOLATE):

1. Extract ONLY party-specific, case-specific facts:
   - names
   - dates
   - amounts
   - addresses
   - IDs (policy numbers, FIR numbers, contract numbers)

2. DO NOT variable-ize:
   - statutes
   - section numbers
   - legal provisions
   - boilerplate legal language

3. Date format MUST be ISO 8601:
   YYYY-MM-DD

4. Currency:
   - Numbers only
   - No symbols (₹, $, etc.)

5. IDs:
   - Provide regex where applicable
   - Example policy numbers, FIR numbers, etc.

6. Keys MUST be snake_case.
7. Deduplicate logically identical variables.
8. Output STRICT JSON ONLY. No prose.

For each variable include:
- key
- label
- description
- example
- required (true/false)
- dtype
- regex (if applicable)

Also return:
- title
- doc_type
- jurisdiction
- similarity_tags
"""

    prompt = f"""
{system_prompt}

DOCUMENT TEXT:
{text}

OUTPUT FORMAT:
{{
  "title": "...",
  "doc_type": "...",
  "jurisdiction": "...",
  "similarity_tags": ["..."],
  "variables": [
    {{
      "key": "policy_number",
      "label": "Policy number",
      "description": "Insurance policy reference as printed on schedule",
      "example": "302786965",
      "required": true,
      "dtype": "string",
      "regex": "^[A-Z0-9-]+$"
    }}
  ],
  "body_md": "Markdown with {{variables}}"
}}
"""

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )

    raw = response.text.strip()

    try:
        parsed = json.loads(raw)
    except Exception:
        raise ValueError("Gemini returned invalid JSON")

    return parsed
