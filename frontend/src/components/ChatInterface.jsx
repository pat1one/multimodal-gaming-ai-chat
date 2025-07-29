import React, { useState } from "react";
import axios from "axios";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [userText, setUserText] = useState("");
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    const formData = new FormData();
    if (image) formData.append("image", image);
    if (audio) formData.append("audio", audio);
    formData.append("user_text", userText);

    const res = await axios.post("http://localhost:8000/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setMessages([
      ...messages,
      { role: "user", content: userText },
      { role: "ai", content: res.data.hint },
    ]);
    setUserText("");
    setImage(null);
    setAudio(null);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ minHeight: 200, border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "8px 0", color: msg.role === "ai" ? "#0077cc" : "#333" }}>
            <b>{msg.role === "ai" ? "AI" : "Вы"}:</b> {msg.content}
          </div>
        ))}
        {loading && <div>Анализируем...</div>}
      </div>
      <input
        type="text"
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
        placeholder="Введите текстовое сообщение или команду..."
        style={{ width: "70%", marginRight: 6 }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        style={{ marginRight: 6 }}
      />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudio(e.target.files[0])}
        style={{ marginRight: 6 }}
      />
      <button onClick={handleSend} disabled={loading || (!userText && !image && !audio)}>
        Отправить
      </button>
    </div>
  );
};

export default ChatInterface;
