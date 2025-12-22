from google import genai
from typing import List, Dict

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
{variables}

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

    return eval(response.text)
