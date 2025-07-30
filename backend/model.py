def get_response(text: str) -> str:
    if "привет" in text.lower():
        return "Привет! Чем могу помочь?"
    return f"Вы сказали: {text}"
