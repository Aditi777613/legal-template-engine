from google import genai

client = genai.Client(
    vertexai=True,
    project="legal-template-engine",
    location="us-central1",
)

MODEL = "text-embedding-004"


def generate_embedding(text: str) -> list[float]:
    try:
        response = client.models.embed_content(
            model=MODEL,
            contents=[text],
        )
        # Access embedding from response - structure may vary
        if hasattr(response, 'embeddings') and response.embeddings:
            if hasattr(response.embeddings[0], 'values'):
                return list(response.embeddings[0].values)
            return list(response.embeddings[0])
        # Fallback: try direct attribute access
        if hasattr(response, 'embedding'):
            return list(response.embedding)
        # Last resort: try dictionary access
        if isinstance(response, dict) and 'embedding' in response:
            return list(response['embedding'])
        raise ValueError("Could not extract embedding from response")
    except Exception as e:
        # Return empty embedding on error to allow processing to continue
        print(f"Embedding generation error: {str(e)}")
        return [0.0] * 768  # Return zero vector as fallback
