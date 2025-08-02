// frontend/src/VoiceInput.tsx
import React, { useState, useRef } from 'react';

const VoiceInput = ({ onResult }: { onResult: (text: string) => void }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Распознавание речи не поддерживается этим браузером.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU'; // или 'en-US'
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (e: any) => {
      console.error("Ошибка речи:", e);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <button
      onClick={listening ? stopListening : startListening}
      className={`mt-2 px-4 py-2 rounded ${listening ? 'bg-red-600' : 'bg-green-600'} hover:opacity-80`}
    >
      {listening ? 'Стоп' : '🎤 Говорить'}
    </button>
  );
};

export default VoiceInput;
