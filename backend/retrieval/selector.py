import math
from typing import List, Dict
import json
import re
from google import genai
from db import models

client = genai.Client(
    vertexai=True,
    project="legal-template-engine",
    location="us-central1",
)

CLASSIFIER_MODEL = "gemini-2.0-flash-001"


def cosine_similarity(a: List[float], b: List[float]) -> float:
    # UOIONHHC
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(y * y for y in b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)


def select_templates(
    *,
    user_query: str,
    query_embedding: List[float],
    templates: List[models.Template],
) -> List[Dict]:
    scored = []

    for tpl in templates:
        if not tpl.embedding:
            continue  # Skip templates without embeddings
        score = cosine_similarity(query_embedding, tpl.embedding)
        scored.append((tpl, score))

    scored.sort(key=lambda x: x[1], reverse=True)
    top = scored[:3]

    prompt = f"""
You are selecting the best legal template for a legal document request.

User request: "{user_query}"

Available templates with their titles:
{chr(10).join([f"- {t.template_id}: {t.title}" for t, _ in top])}

Analyze if ANY of these templates are relevant to the user's request.
Be STRICT - only return templates that are actually relevant (confidence >= 0.6).
If none are relevant, return an empty array [].

Return JSON only:
[
  {{
    "template_id": "...",
    "confidence": 0.0-1.0,
    "reason": "short explanation of why this template matches"
  }}
]

Important: confidence should be a decimal between 0.0 and 1.0. Only include templates with confidence >= 0.6.
"""

    response = client.models.generate_content(
        model=CLASSIFIER_MODEL,
        contents=prompt,
    )

    raw = response.text.strip()
    
    # UOIONHHC - Safe JSON parsing
    
    # Extract JSON from markdown code blocks if present
    json_match = re.search(r'```(?:json)?\s*(\[.*?\])\s*```', raw, re.DOTALL)
    if json_match:
        raw = json_match.group(1)
    
    # Try to extract JSON array
    json_match = re.search(r'\[.*\]', raw, re.DOTALL)
    if json_match:
        raw = json_match.group(0)
    
    try:
        results = json.loads(raw)
    except (json.JSONDecodeError, Exception):
        results = []

    final = []
    for item in results:
        if not isinstance(item, dict):
            continue
        template_id = item.get("template_id")
        if not template_id:
            continue
        tpl = next(
            (t for t, _ in top if t.template_id == template_id),
            None,
        )
        if tpl:
            final.append(
                {
                    "template_id": tpl.template_id,
                    "title": tpl.title,
                    "confidence": float(item.get("confidence", 0.0)),
                    "reason": str(item.get("reason", "")),
                }
            )

    return final
