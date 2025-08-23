import { useLocation } from "react-router-dom";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({ messages, loading, chatEndRef }) {
  const location = useLocation(); // ✅ get current path
  const path = location.pathname;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-slow opacity-50 blur-[30px]"></div>

      {/* Heading / tag line */}
      <span className="block text-black font-bold text-2xl text-center mb-4">
        {path === "/chat"
          ? "Smart health reports in seconds 🩺"
          : path === "/abha-bot"
          ? "Book virtual appointment with doctor"
          : ""}
      </span>

      {/* Chat messages */}
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} msg={msg} />
      ))}

      {/* Loading / typing indicator */}
      {loading && (
        <div className="flex justify-start">
          <div className="px-4 py-2 bg-white text-gray-600 rounded-2xl rounded-bl-none shadow-md animate-pulse">
            AI is typing...
          </div>
        </div>
      )}

      {/* Reference to scroll to bottom */}
      <div ref={chatEndRef} />
    </div>
  );
}
