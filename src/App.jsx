// src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import ProfilePage from "./Pages/userProfile";
import Emergency from './Pages/Emergency';
import FindDoctor from './Pages/FindDoctor';
import Navbar from "./components/navbar";
import Footer from "./components/Footer";

export default function App() {
  const location = useLocation();

  // Pages where Navbar & Footer should NOT show
  const hideNavbar = location.pathname === "/signin" || location.pathname === "/signup";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      {!hideNavbar && <Navbar />}

      {/* Main content expands to push footer down */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/doctors" element={<FindDoctor />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer */}
      {!hideNavbar && <Footer />}
    </div>
  );
}
