from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS для взаимодействия с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Для продакшна ограничь доменом
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модель запроса
class Message(BaseModel):
    text: str

@app.post("/chat")
async def chat_with_model(msg: Message):
    # Здесь будет подключение к твоей нейросети (например, через subprocess или API)
    response = f"Вы сказали: {msg.text} (ответ от модели здесь)"
    return {"response": response}
