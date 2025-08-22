// src/pages/Home.jsx
import Navbar from "../components/navbar"
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-white to-sky-200">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Welcome to Virtual Doctor Assistant
        </h1>
        <p className="mt-2 text-gray-600 text-center max-w-md">
          Get quick medical guidance, consult our chatbot, or find doctors and
          pharmacies nearby.
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mt-10 w-full max-w-5xl">
          {/* Find Nearby Doctor */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">
              🩺 Find Nearby Doctors
            </h2>
            <iframe
              title="Nearby Doctors"
              className="w-full h-64 rounded-lg"
              src="https://www.google.com/maps/embed/v1/search?key=YOUR_GOOGLE_MAPS_API_KEY&q=doctor+near+me"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>

          {/* Find Nearby Medical Store */}
          <div className="bg-white p-4 rounded-2xl shadow">
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
      </main>

      <Footer />
    </div>
  );
}
