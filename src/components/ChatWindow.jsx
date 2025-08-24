// src/components/ChatWindow.jsx
import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [pdfs, setPdfs] = useState([]);

  const handleSend = (text) => {
    if (!text.trim()) return;
    setMessages([...messages, { sender: "user", text }]);

    // Dummy bot response (replace with API call later)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "This is a sample AI response." },
      ]);
    }, 1000);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setPdfs((prev) => [...prev, ...files]);
  };

  return (
    <div className="flex flex-col h-screen bg-[#1e2533] text-white">
      {/* Header */}
      <header className="p-6 text-center text-2xl font-bold">
        Smart health reports in seconds 🩺
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && (
          <div className="text-center text-gray-400">
            Upload a medical PDF and ask your health questions.
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage key={idx} sender={msg.sender} text={msg.text} />
        ))}
      </div>

      {/* Uploaded PDFs above input */}
      {pdfs.length > 0 && (
        <div className="p-3 border-t border-gray-600 bg-[#2a3245]">
          <h2 className="font-semibold text-blue-400">Uploaded PDFs:</h2>
          <ul className="list-disc list-inside">
            {pdfs.map((pdf, idx) => (
              <li key={idx}>
                <a
                  href={URL.createObjectURL(pdf)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 underline"
                >
                  {pdf.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Input box (pinned at bottom) */}
      <ChatInput onSend={handleSend} onFileUpload={handleFileUpload} />
    </div>
  );
}
