import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const location = useLocation();
  const path = location.pathname;

  // Auto scroll when messages or loading change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ✅ Backend logic integrated
  const sendMessage = async (userQuery, pdfFile) => {
    if (!userQuery.trim() && !pdfFile) return;

    // Show user message instantly
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userQuery, pdf: pdfFile?.name },
    ]);

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("user_query", userQuery);
      if (pdfFile) formData.append("pdf_file", pdfFile);

      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log("API Response:", data);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response || "⚠️ No response field in server reply.",
        },
      ]);
    } catch (err) {
      console.error("Fetch error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error connecting to server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-screen mx-auto h-[88vh] bg-white shadow-lg overflow-x-hidden relative">
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-slow opacity-50 blur-[30px]"></div>

      {/* Chat content area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Heading */}
        <span className="block text-sky-400 font-bold text-5xl text-center mb-4 my-6">
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

      {/* ✅ Input with backend logic */}
      <div className="border-t p-3 bg-gray-50">
        <ChatInput onSend={sendMessage} loading={loading} />
      </div>
    </div>
  );
}
