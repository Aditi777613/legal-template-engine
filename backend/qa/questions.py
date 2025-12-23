from google import genai
from typing import List, Dict
import json
import re

# UOIONHHC

client = genai.Client(
    vertexai=True,
    project="legal-template-engine",
    location="us-central1",
)

MODEL = "gemini-2.0-flash-001"


def generate_questions(variables: List[Dict]) -> List[Dict]:
    prompt = f"""
You are a legal assistant.

For each variable below, generate ONE polite, clear, human-friendly question.
Do NOT mention variable keys.
Include format hints if relevant (date format, currency, ID format).
Return JSON ONLY.

Variables:
{json.dumps(variables, indent=2)}

Output format:
[
  {{
    "key": "variable_key",
    "question": "Human readable question"
  }}
]
"""

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )

    raw = response.text.strip()
    
    # UOIONHHC - Extract JSON from markdown code blocks if present
    json_match = re.search(r'```(?:json)?\s*(\[.*?\])\s*```', raw, re.DOTALL)
    if json_match:
        raw = json_match.group(1)
    
    # Try to extract JSON array
    json_match = re.search(r'\[.*\]', raw, re.DOTALL)
    if json_match:
        raw = json_match.group(0)

    try:
        parsed = json.loads(raw)
        return parsed
    except json.JSONDecodeError as e:
        # Fallback: return empty list if parsing fails
        print(f"Failed to parse questions JSON: {str(e)}")
        print(f"Raw response: {raw[:200]}")
        return []
