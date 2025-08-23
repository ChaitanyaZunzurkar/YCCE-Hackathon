import { useLocation } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput"; // ✅ make sure you import this

export default function ChatWindow({ messages, loading, chatEndRef, onSend }) {
  const location = useLocation();
  const path = location.pathname;

  return (
    // ✅ One single card
    <div className="flex flex-col w-screen mx-auto h-[88vh] bg-white shadow-lg overflow-x-hidden relative h-[80vh] ">
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-slow opacity-50 blur-[30px]"></div>

      {/* Chat content area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Heading */}
        <span className="block text-sky-400 font-bold text-5xl text-center mb-4 my-6 ">
          {path === "/chat"
            ? "Smart health reports in seconds 🩺"
            : path === "/abha-bot"
            ? "Book virtual appointment with doctor"
            : ""}
        </span>

        {/* Messages */}
        {messages?.map((msg, idx) => (
          <ChatMessage key={idx} msg={msg} />
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-2xl rounded-bl-none shadow-md animate-pulse">
              AI is typing...
            </div>
          </div>
        )}

        {/* Reference to auto-scroll */}
        <div ref={chatEndRef} />
      </div>

      {/* ✅ Input area inside the same box */}
      <div className="border-t p-3 bg-gray-50">
        <ChatInput onSend={onSend} />
      </div>
    </div>
  );
}
