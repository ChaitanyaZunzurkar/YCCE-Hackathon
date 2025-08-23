// src/pages/Home.jsx
import { useAuth } from "../context/authContext";
import OmniWidget from "../components/OmniWidget";

export default function Home() {
  const { token } = useAuth(); // check if user is logged in

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gradient-to-r from-white to-sky-200 ">
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

    <br />
    <p className="text-lg md:text-2xl text-gray-700 mb-8">
      अपने घर की सुविधा से प्राथमिक स्वास्थ्य सेवा तक पहुँचें। लक्षण एकत्र करें, प्रारंभिक निदान प्राप्त करें, और टेलीमेडिसिन पोर्टल्स से आसानी से जुड़ें।
      {/* Access primary healthcare from the comfort of your home. Collect symptoms, get initial diagnoses, and connect with telemedicine portals seamlessly.   */}
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
    {/* <img
      src="src\assets\latest.png"
      alt="Virtual Doctor Illustration"
      className="mt-4 mx-2 w-[240px] h-[240px] max-w-lg text-black font-bold"
    /> */}
  </div>
</section>

{/* ABHA Section */}
      <section className=" py-16 px-6 flex  items-center text-center pt-4">
         <img
      src="src\assets\latest.png"
      alt="Virtual Doctor Illustration"
      className="mt-4 mx-2 w-[240px] h-[240px] max-w-lg text-black font-bold"
    />

    <div className="flex flex-col">
       <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Get Your Ayushman Bharat Health ID (ABHA)
        </h2>
        <p className="text-gray-700 text-lg max-w-xl mb-6">
          Ayushman Bharat Digital Health Mission (ABDM) creates a nationwide digital health ecosystem, giving every Indian a unique health ID (ABHA). Securely access your health records and connect with healthcare providers digitally.
        </p>
       
     

    </div>
       <a
          // href="https://healthid.ndhm.gov.in" // ABHA form link
          href="http://localhost:5173/abha-bot" // ABHA form link
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-2 relative top-[130px] right-[180px] bg-blue-500 text-white font-semibold rounded-full shadow-lg transition bg-sky-500 hover:bg-white text-white  hover:scale-105 shadow-lg hover:shadow-[0_8px_20px_rgba(59,130,246,0.5)] hover:text-blue-500 hover:font-bold"
        >
        <span className="font-bold px-2 relative mt-3 text-white text-xl hover:text-blue-500">
          Register for ABHA
          </span>  
        </a>
      
      </section>

    </div>
  );
}
