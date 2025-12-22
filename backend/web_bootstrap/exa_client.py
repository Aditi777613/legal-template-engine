import os
import requests

EXA_API_KEY = os.getenv("EXA_API_KEY")
EXA_SEARCH_URL = "https://api.exa.ai/search"


def search_legal_templates(query: str, num_results: int = 3):
    headers = {
        "Authorization": f"Bearer {EXA_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "query": query,
        "num_results": num_results,
        "use_autoprompt": True,
        "type": "neural",
    }

    response = requests.post(
        EXA_SEARCH_URL,
        headers=headers,
        json=payload,
        timeout=15,
    )

    response.raise_for_status()
    results = response.json().get("results", [])

    documents = []

    for r in results:
        text = r.get("text", "")
        if text:
            documents.append(
                {
                    "title": r.get("title"),
                    "url": r.get("url"),
                    "text": text,
                }
            )

    return documents
