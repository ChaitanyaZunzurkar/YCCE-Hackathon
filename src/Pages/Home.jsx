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
    <p className="text-lg md:text-2xl text-gray-700 mb-8">
      Access primary healthcare from the comfort of your home. Collect symptoms, get initial diagnoses, and connect with telemedicine portals seamlessly.  
      <span className="block mt-2 font-bold text-blue-800">
        Integrated with India’s Ayushman Bharat Digital Health Mission
      </span>
    </p>
    <div className="flex flex-row md:flex-row justify-center gap-4">
      <a
        href="#get-started"
        className="px-6 py-3 border border-blue-300 bg-blue-300 text-white rounded-full font-semibold hover:bg-blue-300 transition"
      >
   <span className="text-blue-900">        Get Started</span>
      </a>
      <a
        href="#learn-more"
        className="px-6 py-3 border border-blue-300 text-green-600 rounded-full font-semibold hover:bg-green-100 transition"
      >
        Learn More
      </a>
    </div>
    <img
      src="src\assets\latest.png"
      alt="Virtual Doctor Illustration"
      className="mt-4 mx-2 w-[240px] h-[240px] max-w-lg text-black font-bold"
    />
  </div>
</section>


      {/* <main className="flex-1 flex flex-col items-center justify-center w-full p-6"> */}
        {/* <h1 className="text-3xl font-bold text-gray-800 text-center">
          Welcome to Virtual Doctor Assistant
        </h1>
        <p className="mt-2 text-gray-600 text-center max-w-md">
          Get quick medical guidance, consult our chatbot, or find doctors and
          pharmacies nearby.
        </p>

        {/* Features */}
        {/* <div className="grid md:grid-cols-2 gap-6 mt-10 w-full max-w-5xl"> */}
          {/* Find Nearby Doctor */}
          {/* <div className="bg-white p-4 rounded-2xl shadow"> */}
            {/* <h2 className="text-lg font-semibold text-blue-600 mb-2"> */}
              {/* 🩺 Find Nearby Doctors */}
            {/* </h2>
            <iframe
              title="Nearby Doctors"
              className="w-full h-64 rounded-lg"
              src="https://www.google.com/maps/embed/v1/search?key=YOUR_GOOGLE_MAPS_API_KEY&q=doctor+near+me"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div> */}

          {/* Find Nearby Medical Store */}
          {/* <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-green-600 mb-2">
              💊 Find Medical Stores Nearby
            </h2>
            <iframe
              title="Nearby Medical Stores"
              className="w-full h-64 rounded-lg"
              src="https://www.google.com/maps/embed/v1/search?key=YOUR_GOOGLE_MAPS_API_KEY&q=pharmacy+near+me"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </main> */} 
    </div>
  );
}
