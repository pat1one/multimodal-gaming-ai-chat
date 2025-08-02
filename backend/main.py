from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# Подключаем статику из React
app.mount("/", StaticFiles(directory="static", html=True), name="static")

# Обработка корневого маршрута
@app.get("/")
async def root():
    return FileResponse("static/index.html")

# Маршрут для чата
@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    message = data.get("message", "")
    # Подключение модели (позже заменим)
    return {"response": f"Вы сказали: {message}"}
import requests

@app.post("/ask")
def ask_llm(prompt: str, model: str = "llama3"):
    response = requests.post(
        f"http://localhost:11434/api/generate",
        json={"model": model, "prompt": prompt, "stream": False},
    )
    data = response.json()
    return {"response": data.get("response", "")}
