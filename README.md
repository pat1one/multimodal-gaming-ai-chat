# Multimodal Gaming AI Chat

**AI-чат для гейминга с мультимодальным анализом (изображения, аудио, текст)**

## Возможности

- Анализ скриншотов, аудиофайлов и текстовых сообщений для игровых ситуаций
- Генерация умных подсказок и советов игроку
- Веб-интерфейс в стиле ChatGPT, можно отправлять фото/звук/текст

## Быстрый старт

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

- Откройте [http://localhost:3000](http://localhost:3000)
- Backend по умолчанию слушает на порту 8000

---

**Архитектура:**  
- Python (FastAPI, PyTorch, Transformers)  
- React (чат-интерфейс)

---

Мультимодальный анализ реализован через CLIP, Wav2Vec2, GPT-2.  
Можете дообучать модели на своих игровых данных для лучшей точности!
