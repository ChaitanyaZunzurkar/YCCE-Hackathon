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
      className="p-4 border-t bg-white flex items-center space-x-2 shadow-inner"
    >
      <input
        type="text"
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        placeholder="Ask something..."
        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdfFile(e.target.files[0])}
        className="hidden"
        id="pdfUpload"
      />
      <label
        htmlFor="pdfUpload"
        className="cursor-pointer bg-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-300"
      >
        📎
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
