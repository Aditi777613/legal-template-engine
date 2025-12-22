from google import genai

client = genai.Client(
    vertexai=True,
    project="legal-template-engine",
    location="us-central1",
)

MODEL = "text-embedding-004"


def generate_embedding(text: str) -> list[float]:
    response = client.models.embed_content(
        model=MODEL,
        content=text,
    )
    return response["embedding"]
