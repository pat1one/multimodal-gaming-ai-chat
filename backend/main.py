from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import get_response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "API is running"}  # просто проверка

@app.post("/chat")
async def chat(message: Message):
    response = get_response(message.text)
    return {"response": response}
