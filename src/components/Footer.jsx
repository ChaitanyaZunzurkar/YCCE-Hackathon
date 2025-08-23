export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      
      {/* Multi-lingual / Country Selector Bar */}
      <a className="flex flex-row md:flex-row items-center justify-center gap-4 bg-gray-800 py-3 mx-auto" href="http://localhost:5173/">
        {/* <div className="flex items-center gap-2"> */}
          
          <a href="http://localhost:5173/" alt="" className="font-bold text-xl">
          <span className="text-white">   Back to Top</span>
        </a>

      </a>

      {/* Links Section */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-rows-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        <div>
          <h3 className="font-semibold mb-3">About Us</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white">Our Mission</a></li>
            <li><a href="#" className="hover:text-white">Team</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Services</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white">Consultation</a></li>
            <li><a href="#" className="hover:text-white">Diagnostics</a></li>
            <li><a href="#" className="hover:text-white">Telemedicine</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">FAQs</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Use</a></li>
            <li><a href="#" className="hover:text-white">Disclaimer</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-white text-sm">
        © {new Date().getFullYear()} Virtual Doctor Assistant | Made with ❤️
      </div>
    </footer>
  );
}
