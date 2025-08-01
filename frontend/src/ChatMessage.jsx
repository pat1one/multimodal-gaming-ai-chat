const ChatMessage = ({ message, sender }) => {
  const isUser = sender === "user";
  return (
    <div className={`my-2 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-md ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;
