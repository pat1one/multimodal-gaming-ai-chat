from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Загружаем модель и токенизатор (один раз при запуске)
tokenizer = AutoTokenizer.from_pretrained("gpt2")
model = AutoModelForCausalLM.from_pretrained("gpt2")

def generate_response(message: str) -> str:
    inputs = tokenizer.encode(message, return_tensors="pt")
    outputs = model.generate(inputs, max_length=150, pad_token_id=tokenizer.eos_token_id)
    reply = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return reply
