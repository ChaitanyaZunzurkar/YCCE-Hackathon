// src/components/ChatInput.jsx
import { useState } from "react";
import { Paperclip, Send, FileText, X } from "lucide-react";

export default function ChatInput({ onSend, loading }) {
  const [input, setInput] = useState("");
  const [pdf, setPdf] = useState(null);

  const handleSend = () => {
    if (!input.trim() && !pdf) return;
    onSend(input, pdf);
    setInput("");
    setPdf(null);
  };

  const handleRemovePdf = () => {
    setPdf(null);
  };

  return (
    <div className="p-4 border-t border-gray-700 bg-[#1e2533]">
      {/* PDF preview above input */}
      {pdf && (
        <div className="flex items-center bg-[#2a3245] border border-gray-600 rounded-xl px-3 py-2 mb-3 text-sm text-white shadow-md">
          <FileText className="w-4 h-4 text-blue-400 mr-2" />
          <span className="truncate max-w-[200px]">{pdf.name}</span>
          <button
            onClick={handleRemovePdf}
            className="ml-2 text-gray-400 hover:text-red-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Chat input area */}
      <div className="flex items-center space-x-2 bg-[#2a3245] rounded-full px-4 py-2">
        {/* File upload */}
        <label className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-full bg-green-500 hover:bg-green-600">
          <Paperclip className="text-white w-4 h-4" />
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setPdf(e.target.files[0])}
          />
        </label>

        {/* Input */}
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          placeholder="Ask about medical reports, symptoms, or health questions..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 shadow-md disabled:opacity-50"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
