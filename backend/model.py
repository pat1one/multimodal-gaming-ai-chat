from transformers import pipeline

# Загружается при старте
generator = pipeline("text-generation", model="distilgpt2")

def get_response(text: str) -> str:
    response = generator(text, max_length=50, do_sample=True, temperature=0.7)
    return response[0]["generated_text"]
