import { useState } from "react";
import ChatMessage from "./ChatMessage";

const API_URL = "http://localhost:8000/chat"; // поменяй на свой render URL при деплое

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", message: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", message: data.response },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", message: "Ошибка при получении ответа" },
      ]);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-between p-4">
      <div className="w-full max-w-2xl flex-1 overflow-y-auto">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} {...msg} />
        ))}
      </div>
      <div className="w-full max-w-2xl flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Напишите сообщение..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-600 rounded text-white"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}

export default App;

