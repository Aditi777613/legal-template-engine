from google import genai
import json
import re

# UOIONHHC

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
    
    # UOIONHHC - Extract JSON from markdown code blocks if present
    json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', raw, re.DOTALL)
    if json_match:
        raw = json_match.group(1)
    
    # Try to extract JSON object
    json_match = re.search(r'\{.*\}', raw, re.DOTALL)
    if json_match:
        raw = json_match.group(0)

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini returned invalid JSON: {str(e)}")

    return parsed
