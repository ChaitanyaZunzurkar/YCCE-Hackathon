// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
// import Onboarding from "./pages/Onboarding";
// import Chat from "./pages/Chat";'
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import './index.css'

export default function App() {
  return (
     
     <Routes>
      {/* Home Page */}
      <Route path="/" element={<Home />} />  

      {/* Onboarding Page
      <Route path="/onboarding" element={<Onboarding />} /> */}

      {/* Chatbot Page */}
      {/* <Route path="/chat" element={<Chat />} /> */}

      {/* Redirect unknown routes */}
      {/* <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
  );
}
