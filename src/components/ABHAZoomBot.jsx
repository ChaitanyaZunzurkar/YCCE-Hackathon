import { useState, useRef, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
// import VoiceAssistant from './VoiceAssistan'


export default function ABHAZoomBot() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll when messages or loading change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (userQuery, pdfFile) => {
    if (!userQuery.trim() && !pdfFile) return;

    // if (showVoiceAssistant) {
    //   setShowVoiceAssistant(false);
    // }


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
      console.log("API Response:", data); // 👈 debug log

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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 overflow-x-hidden w-screen ">

      {/* Header */}
      {/* <div className="bg-blue-600 text-white p-4 text-xl font-bold shadow-md flex items-center mx-auto w-[50%] mt-2"> */}
        {/* <span className="mr-2">🩺</span> AI Report Analyzer */}
      {/* </div> */}

      {/* {showVoiceAssistant && (
        <div className="flex justify-center p-4">
          <VoiceAssistant onResult={(transcript) => sendMessage(transcript)} />
        </div>
      )} */}

      {/* Chat Window */}
      <ChatWindow
        messages={messages}
        loading={loading}
        chatEndRef={chatEndRef}
      />

      {/* Input */}
      <ChatInput onSend={sendMessage} loading={loading} />
    </div>
  );
}
