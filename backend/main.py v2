from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from multimodal_ai import GamingMultimodalAI
import shutil
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
ai = GamingMultimodalAI()

@app.post("/analyze")
async def analyze(
    image: UploadFile = File(None),
    audio: UploadFile = File(None),
    user_text: str = Form("")
):
    image_path, audio_path = None, None
    if image:
        image_path = f"tmp_{image.filename}"
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    if audio:
        audio_path = f"tmp_{audio.filename}"
        with open(audio_path, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)
    text_prompts = [
        "игрок сражается с боссом",
        "игрок исследует подземелье",
        "игрок отдыхает на базе"
    ]
    result = ai.analyze_game_state(image_path, audio_path, text_prompts, user_text)
    # Clean up temp files
    if image_path and os.path.exists(image_path):
        os.remove(image_path)
    if audio_path and os.path.exists(audio_path):
        os.remove(audio_path)
    return result
