import os
import requests

# UOIONHHC

# EXA_API_KEY is read from environment variable (.env file)
EXA_SEARCH_URL = "https://api.exa.ai/search"


def search_legal_templates(query: str, num_results: int = 2):
    """Search for legal templates using Exa.ai - UOIONHHC"""
    # Read from environment variable only
    api_key = os.getenv("EXA_API_KEY")
    if not api_key:
        raise ValueError("EXA_API_KEY environment variable is not set. Please add it to your .env file.")
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "query": query,
        "num_results": num_results,  # Only top 2
        "use_autoprompt": True,
        "type": "neural",
        "contents": {
            "text": True  # Request text content
        }
    }

    try:
        response = requests.post(
            EXA_SEARCH_URL,
            headers=headers,
            json=payload,
            timeout=15,
        )
        response.raise_for_status()
        results = response.json().get("results", [])
    except requests.exceptions.RequestException as e:
        print(f"Exa API error: {str(e)}")
        raise

    documents = []

    for r in results[:2]:  # ONLY top 2 (important)
        # Get text content from the result
        content = r.get("text", "")
        
        if content:
            documents.append({
                "source": r.get("url"),
                "title": r.get("title", "Untitled Document"),
                "snippet": content[:1500],  # First 1500 chars
                "type": "web_bootstrap",
                "full_text": content  # Store full text for templating
            })

    return documents