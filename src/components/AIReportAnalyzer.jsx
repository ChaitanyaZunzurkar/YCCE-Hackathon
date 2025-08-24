import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Track uploaded PDFs
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const location = useLocation();
  const path = location.pathname;

  // Auto scroll when messages or loading change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Backend logic
  const sendMessage = async (userQuery, pdfFile) => {
    if (!userQuery.trim() && !pdfFile) return;

    // Add uploaded PDF to the top section
    if (pdfFile) setUploadedFiles((prev) => [...prev, pdfFile]);

    // Show user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userQuery },
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

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response || "⚠️ No response field in server reply.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error connecting to server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-screen mx-auto h-[88vh] bg-gray-900 shadow-lg overflow-x-hidden relative text-white">
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 animate-gradient-slow opacity-30 blur-[30px]"></div>

      {/* Chat content area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Heading */}
        <span className="block text-white font-bold text-4xl text-center mb-4 my-6">
          {path === "/chat"
            ? "Smart health reports in seconds 🩺"
            : path === "/abha-bot"
            ? "Book virtual appointment with doctor"
            : ""}
        </span>

        {/* Uploaded PDFs at top */}
        {uploadedFiles.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Uploaded PDFs:</h3>
            <ul className="list-disc list-inside space-y-1">
              {uploadedFiles.map((file, idx) => (
                <li key={idx}>
                  <a
                    href={URL.createObjectURL(file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Messages */}
        {messages?.map((msg, idx) => (
          <ChatMessage key={idx} msg={msg} />
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 bg-gray-700 text-white rounded-2xl rounded-bl-none shadow-md animate-pulse">
              AI is typing...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3 bg-gray-800">
        <ChatInput onSend={sendMessage} loading={loading} />
      </div>
    </div>
  );
}
