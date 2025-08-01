from transformers import pipeline

# Загружаем модель
chatbot = pipeline("text-generation", model="gpt2")

def generate_response(prompt):
    result = chatbot(prompt, max_length=100, num_return_sequences=1)
    return result[0]["generated_text"]
