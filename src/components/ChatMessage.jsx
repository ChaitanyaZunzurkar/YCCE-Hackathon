export default function ChatMessage({ msg }) {
  const isUser = msg.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl shadow max-w-xs break-words ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        {msg.text && <p>{msg.text}</p>}

        {msg.pdf && (
          <a
            href={URL.createObjectURL(msg.pdf)}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-sm text-blue-600 underline"
          >
            📄 {msg.pdf.name}
          </a>
        )}
      </div>
    </div>
  );
}
