import { useState } from "react";

export default function AuthHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      {isLoggedIn ? (
        // ✅ Show Profile Avatar when logged in
        <img
          src="https://i.pravatar.cc/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer"
          onClick={() => setIsLoggedIn(false)} // simulate logout
        />
      ) : (
        // ❌ Show Login & Sign Up buttons when not logged in
        <div className="flex gap-2">
          <button
            onClick={() => setIsLoggedIn(true)} // simulate login
            className="px-4 py-1 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
          >
            Login
          </button>
          <button className="px-4 py-1 rounded-lg border border-blue-500 text-blue-600 font-medium hover:bg-blue-50 transition">
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
