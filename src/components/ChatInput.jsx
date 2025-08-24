import { useState } from "react";
import { Paperclip, Send } from "lucide-react";

export default function ChatInput({ onSend, loading }) {
  const [input, setInput] = useState("");
  const [pdf, setPdf] = useState(null);

  const handleSend = () => {
    if (!input.trim() && !pdf) return;
    onSend(input, pdf);
    setInput("");
    setPdf(null);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Upload button */}
      <label className="cursor-pointer p-2 bg-green-500 text-white rounded-full hover:bg-green-600">
        <Paperclip size={18} />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdf(e.target.files[0])}
          className="hidden"
        />
      </label>

      {/* Text input */}
      <input
        type="text"
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
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
        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
