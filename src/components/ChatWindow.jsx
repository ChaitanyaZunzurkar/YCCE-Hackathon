import ChatMessage from "./ChatMessage";

export default function ChatWindow({ messages, loading, chatEndRef }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} msg={msg} />
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="px-4 py-2 bg-white text-gray-600 rounded-2xl rounded-bl-none shadow-md animate-pulse">
            AI is typing...
          </div>
        </div>
      )}

      <div ref={chatEndRef} />
    </div>
  );
}

