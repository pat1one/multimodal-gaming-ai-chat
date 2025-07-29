import torch
from transformers import CLIPProcessor, CLIPModel, Wav2Vec2Processor, Wav2Vec2ForCTC, GPT2LMHeadModel, GPT2Tokenizer
from PIL import Image
import soundfile as sf
import librosa
import requests

class GamingMultimodalAI:
    def __init__(
        self,
        clip_model_name="openai/clip-vit-base-patch16",
        wav2vec_model_name="facebook/wav2vec2-base-960h",
        gpt2_model_name="gpt2",
        engine_api_url=None  # URL игрового движка (например, http://localhost:5000/game_state)
    ):
        # Модель CLIP для изображений и текста
        self.clip_model = CLIPModel.from_pretrained(clip_model_name)
        self.clip_processor = CLIPProcessor.from_pretrained(clip_model_name)
        # Модель Wav2Vec2 для речи/звука
        self.wav2vec_processor = Wav2Vec2Processor.from_pretrained(wav2vec_model_name)
        self.wav2vec_model = Wav2Vec2ForCTC.from_pretrained(wav2vec_model_name)
        # Модель GPT-2 для генерации подсказок
        self.gpt2_tokenizer = GPT2Tokenizer.from_pretrained(gpt2_model_name)
        self.gpt2_model = GPT2LMHeadModel.from_pretrained(gpt2_model_name)
        self.gpt2_model.eval()
        # URL вашего игрового движка
        self.engine_api_url = engine_api_url

    def analyze_screenshot(self, image_path, text_prompts):
        image = Image.open(image_path).convert("RGB")
        inputs = self.clip_processor(text=text_prompts, images=image, return_tensors="pt", padding=True)
        with torch.no_grad():
            outputs = self.clip_model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)
            best_idx = probs.argmax().item()
        return text_prompts[best_idx], probs[0][best_idx].item()

    def recognize_audio(self, audio_path):
        speech, sample_rate = sf.read(audio_path)
        if sample_rate != 16000:
            speech = librosa.resample(speech, orig_sr=sample_rate, target_sr=16000)
            sample_rate = 16000
        # Если аудио стерео, берём только первый канал
        if len(speech.shape) > 1:
            speech = speech[:, 0]
        input_values = self.wav2vec_processor(speech, sampling_rate=sample_rate, return_tensors="pt").input_values
        with torch.no_grad():
            logits = self.wav2vec_model(input_values).log
