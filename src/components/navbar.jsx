// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
      {/* Left: Logo */}
      <div className="text-xl font-bold text-blue-600">🩺 VirtualDoc</div>

      {/* Middle: Links */}
      <div className="space-x-6 text-gray-700 font-medium">
        <Link to="/">Home</Link>
        <Link to="/chat">Chatbot</Link>
      </div>

      {/* Right: User Profile */}
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
        👤
      </div>
    </nav>
  );
}
