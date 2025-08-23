import { useState } from "react";

export default function ChatInput({ onSend, loading }) {
  const [userQuery, setUserQuery] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(userQuery, pdfFile);
    setUserQuery("");
    setPdfFile(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-transparent flex items-center space-x-2 shadow-inner  "
    >
      <input
        type="text"
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        placeholder="Ask something..."
        className="flex-1 border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black "
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-blue-900 to-blue-900 text-white px-8 py-2 mx-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
       <span className="font-bold text-white"> Send</span>
      </button>
    </form>
  );
}
