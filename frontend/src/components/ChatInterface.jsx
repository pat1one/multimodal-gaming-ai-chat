import { useState } from "react";
import axios from "axios";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");

    const res = await axios.post("http://localhost:8000/chat", {
      text: input,
    });

    const botMsg = { sender: "bot", text: res.data.response };
    setMessages([...messages, userMsg, botMsg]);
  };

  return (
    <div className="w-full max-w-xl bg-gray-800 p-4 rounded-xl shadow-lg">
      <div className="h-96 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.sender === "user"
                ? "bg-blue-600 text-right"
                : "bg-gray-700 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Отправить
        </button>
      </div>
    </div>
  );
}

