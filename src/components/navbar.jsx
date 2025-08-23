// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // 1️⃣ Added state for dropdown menu
  const [showDropdown, setShowDropdown] = useState(false); // <-- NEW

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/signin");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md ">
      {/* Left: Logo */}
      <div
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        🩺 VirtualDoc
      </div>

      {/* Middle: Links */}
      <div className="space-x-16 text-gray-700 font-bold text-lg">
        <Link to="/">Home</Link>
        <Link to="/chat">Chatbot</Link>
        <Link to="/doctors">Find Doctors</Link>
        <Link to="/emergency">Emergency</Link>
        <Link to="/abha-bot">ABHA</Link>
      </div>

      {/* Right: User Profile or Auth Buttons */}
      {isLoggedIn ? (
        <div className="relative flex items-center space-x-4">
          {/* 2️⃣ Updated user icon to be clickable */}
          <div
            className="flex items-center space-x-2 cursor-pointer"  // <-- cursor-pointer added
            onClick={() => setShowDropdown(!showDropdown)}           // <-- toggles dropdown
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline font-medium text-gray-800">
              {user?.name}
            </span>
          </div>

          {/* 3️⃣ Added dropdown menu */}
          {showDropdown && (                                        
           <div className="absolute right-0 mt-12 w-40 rounded-lg flex flex-col gap-2 p-2">
  <button
    onClick={() => { navigate("/profile"); setShowDropdown(false); }}
    className="bg-sky-500 text-white rounded-full flex items-center justify-center 
               cursor-pointer px-5 py-2 gap-2 shadow-sm
               hover:bg-sky-600 hover:scale-105 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)]  
               transition-all duration-300 mr-3"
  >
    Profile
  </button>

  <button
    onClick={handleLogout}
    className="bg-sky-500 text-white rounded-full flex items-center justify-center 
               cursor-pointer px-5 py-2 gap-2 shadow-sm
               hover:bg-sky-600 hover:scale-105 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] 
               transition-all duration-300 z-10"
  >
    Logout
  </button>
</div>

          )}
        </div>
      ) : (
        <div className="flex space-x-4">
          {/* Sign In Button */}
          <Link
            to="/signin"
            className="group bg-sky-500 hover:bg-white text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 px-5 py-2 gap-2 shadow-lg hover:shadow-[0_8px_20px_rgba(59,130,246,0.5)] hover:text-black hover:font-bold"
          >
            <p className="font-semibold text-white group-hover:text-black">Sign In</p>
          </Link>

          {/* Sign Up Button */}
          <Link
            to="/signup"
            className="group bg-sky-500 hover:bg-white text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 hover:shadow-[0_8px_20px_rgba(59,130,246,0.5)] transition-all duration-300 px-5 py-2 gap-2 shadow-md hover:text-black"
          >
            <p className="font-semibold text-white group-hover:text-black">Sign Up</p>
          </Link>
        </div>
      )}
    </nav>
  );
}
