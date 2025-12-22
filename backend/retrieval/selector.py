import math
from typing import List, Dict
from google import genai
from db import models

client = genai.Client(
    vertexai=True,
    project="legal-template-engine",
    location="us-central1",
)

CLASSIFIER_MODEL = "gemini-2.0-flash-001"


def cosine_similarity(a: List[float], b: List[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(y * y for y in b))
    return dot / (mag_a * mag_b)


def select_templates(
    *,
    user_query: str,
    query_embedding: List[float],
    templates: List[models.Template],
) -> List[Dict]:
    scored = []

    for tpl in templates:
        score = cosine_similarity(query_embedding, tpl.embedding)
        scored.append((tpl, score))

    scored.sort(key=lambda x: x[1], reverse=True)
    top = scored[:3]

    prompt = f"""
You are selecting the best legal template.

User request:
"{user_query}"

Templates:
{[t.template_id for t, _ in top]}

Return JSON only:
[
  {{
    "template_id": "...",
    "confidence": 0.0-1.0,
    "reason": "short explanation"
  }}
]
"""

    response = client.models.generate_content(
        model=CLASSIFIER_MODEL,
        contents=prompt,
    )

    try:
        results = eval(response.text)
    except Exception:
        results = []

    final = []
    for item in results:
        tpl = next(
            (t for t, _ in top if t.template_id == item["template_id"]),
            None,
        )
        if tpl:
            final.append(
                {
                    "template_id": tpl.template_id,
                    "title": tpl.title,
                    "confidence": item.get("confidence", 0.0),
                    "reason": item.get("reason", ""),
                }
            )

    return final
