export default function ChatMessage({ msg }) {
  return (
    <div
      className={`flex ${
        msg.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`px-4 py-3 rounded-2xl max-w-lg shadow-md transition-transform duration-200 ${
          msg.sender === "user"
            ? "bg-blue-500 text-white rounded-br-none hover:scale-105"
            : "bg-white text-gray-800 rounded-bl-none hover:scale-105"
        }`}
      >
        <p className="leading-relaxed">{msg.text}</p>
        {msg.pdf && (
          <span className="mt-2 text-xs block bg-gray-200 text-gray-700 px-2 py-1 rounded-md">
            📄 {msg.pdf}
          </span>
        )}
      </div>
    </div>
  );
}

