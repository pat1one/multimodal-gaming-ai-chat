from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from model import generate_response

app = FastAPI()

# Для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # или конкретный URL
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/chat")
async def chat(req: Request):
    data = await req.json()
    user_message = data.get("message", "")
    response = generate_response(user_message)
    return {"response": response}

