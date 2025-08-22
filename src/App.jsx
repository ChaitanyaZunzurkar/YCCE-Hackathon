// src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import ProfilePage from "./Pages/userProfile";
import Emergency from './Pages/Emergency';
import FindDoctor from './Pages/FindDoctor';
import Navbar from "./components/navbar";

export default function App() {
  const location = useLocation();

  // Pages where Navbar should NOT show
  const hideNavbar = location.pathname === "/signin" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />} {/* show navbar only on allowed pages */}

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
    </>
  );
}
