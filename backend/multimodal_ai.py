import torch
from transformers import CLIPProcessor, CLIPModel, Wav2Vec2Processor, Wav2Vec2ForCTC, GPT2LMHeadModel, GPT2Tokenizer
from PIL import Image
import soundfile as sf
import librosa

class GamingMultimodalAI:
    def __init__(self):
        self.clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch16")
        self.clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch16")
        self.wav2vec_processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
        self.wav2vec_model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")
        self.gpt2_tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
        self.gpt2_model = GPT2LMHeadModel.from_pretrained("gpt2")
        self.gpt2_model.eval()

    def analyze_screenshot(self, image_path, text_prompts):
        if not image_path:
            return "нет изображения", 0.0
        image = Image.open(image_path).convert("RGB")
        inputs = self.clip_processor(text=text_prompts, images=image, return_tensors="pt", padding=True)
        with torch.no_grad():
            outputs = self.clip_model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)
            best_idx = probs.argmax().item()
        return text_prompts[best_idx], probs[0][best_idx].item()

    def recognize_audio(self, audio_path):
        if not audio_path:
            return ""
        speech, sample_rate = sf.read(audio_path)
        if sample_rate != 16000:
            speech = librosa.resample(speech, orig_sr=sample_rate, target_sr=16000)
            sample_rate = 16000
        input_values = self.wav2vec_processor(speech, sampling_rate=sample_rate, return_tensors="pt").input_values
        with torch.no_grad():
            logits = self.wav2vec_model(input_values).logits
        predicted_ids = torch.argmax(logits, dim=-1)
        transcription = self.wav2vec_processor.batch_decode(predicted_ids)[0]
        return transcription.lower()

    def generate_hint(self, situation_description, user_text=""):
        prompt = f"Игровая ситуация: {situation_description}\nВвод пользователя: {user_text}\nСовет игроку:"
        input_ids = self.gpt2_tokenizer.encode(prompt, return_tensors="pt")
        with torch.no_grad():
            output = self.gpt2_model.generate(input_ids, max_length=80, do_sample=True, top_p=0.95)
        hint = self.gpt2_tokenizer.decode(output[0], skip_special_tokens=True)
        return hint.split("Совет игроку:")[-1].strip()

    def analyze_game_state(self, image_path, audio_path, text_prompts, user_text=""):
        image_result, image_conf = self.analyze_screenshot(image_path, text_prompts)
        audio_result = self.recognize_audio(audio_path)
        situation = f"{image_result} (уверенность: {image_conf:.2f}); в аудио слышно: \"{audio_result}\""
        hint = self.generate_hint(situation, user_text)
        return {
            "image_action": image_result,
            "image_confidence": image_conf,
            "audio_transcription": audio_result,
            "hint": hint,
            "situation": situation
        }
