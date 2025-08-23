// src/pages/Home.jsx
import { useAuth } from "../context/authContext";
import OmniWidget from "../components/OmniWidget";

export default function Home() {
  const { token } = useAuth(); // check if user is logged in

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gradient-to-r from-white to-sky-200">

      {/* Load the widget only if user is logged in */}
      {token && <OmniWidget />}

    <section className="relative bg-gradient-to-r from-white to-sky-200 min-h-screen flex items-center justify-center">
  <div className="container mx-auto px-6 text-center">
    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
      Your Virtual Doctor, Anywhere, Anytime
    </h1>
    {/* <h1 className="text-4xl md:text-6xl font-extrabold mb-6 
  bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 
  bg-clip-text text-transparent">
  Your Virtual Doctor, Anywhere, Anytime
</h1> */}

    
    <p className="text-lg md:text-2xl text-gray-700 mb-8">
      Access primary healthcare from the comfort of your home. Collect symptoms, get initial diagnoses, and connect with telemedicine portals seamlessly.  
      <span className="block mt-2 font-bold text-blue-800">
        Integrated with India’s Ayushman Bharat Digital Health Mission
      </span>
    </p>
    <div className="flex group flex-row md:flex-row justify-center gap-4">
      <a
        href="http://localhost:5173/chat"
        className="px-6 py-3 border border-blue-300 bg-blue-300 text-white rounded-full font-semibold group-hover:bg-transparent transition group cursor-pointer"
      >
   <span className="text-blue-900">        Get Started</span>
      </a>
      <a
        href="http://localhost:5173/emergency"
        className="px-6 py-3 border border-blue-300 rounded-full font-semibold group-hover:bg-blue-300 transition cursor-pointer"
      >
        <span className="text-blue-900">Learn More</span>
        
      </a>
    </div>
    <img
      src="src\assets\latest.png"
      alt="Virtual Doctor Illustration"
      className="mt-4 mx-2 w-[240px] h-[240px] max-w-lg text-black font-bold"
    />
  </div>
</section>

    </div>
  );
}
