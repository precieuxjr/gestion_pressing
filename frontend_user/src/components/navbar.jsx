import { useState, useEffect } from "react";
import Theme from "./theme";
import logo from '../assets/logo.png';

function Navbar() {
  const [isOpen, setOpen] = useState(false);
  
  const nav_item = [
    { nom: 'ACCUEIL', ancre: 'accueil' },
    { nom: 'SERVICES', ancre: 'services' },
    { nom: 'GALERIE', ancre: 'galerie' },
    { nom: 'A PROPOS', ancre: 'a-propos' },
    { nom: 'CONTACT', ancre: 'contact' }
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-gray-300/30 backdrop-blur-md border-b border-white/10 font-sans">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-20 w-auto" />
            <span className="font-extrabold text-lg tracking-wider text-[#0F172A]">
              SMART<br/><span className="text-[#2563EB] text-xs tracking-widest block -mt-1">PRESSING</span>
            </span>
          </div>

          <Theme />

          {/* MENU DESKTOP */}
          <ul className="hidden md:flex items-center gap-8">
            {nav_item.map((item) => (
              <li key={item.nom}>
                <a
                  href={`#${item.ancre}`}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  {item.nom}
                </a>
              </li>
            ))}
          </ul>

          {/* BOUTON BURGER */}
          <button
            onClick={() => setOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* MENU MOBILE (sans animation) */}
      {isOpen && (
        <>
          {/* Overlay sombre (ferme au clic) */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          />
          <div className="fixed top-20 left-0 w-full z-50 md:hidden">
            <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl rounded-b-2xl mx-4 overflow-hidden">
              <ul className="flex flex-col p-6 gap-4">
                {nav_item.map((item) => (
                  <li key={item.nom}>
                    <a
                      href={`#${item.ancre}`}
                      onClick={() => setOpen(false)}
                      className="block text-center text-lg font-semibold text-gray-800 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    >
                      {item.nom}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;