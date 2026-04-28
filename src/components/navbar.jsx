import { useState } from "react";
import Theme from "./theme";
import logo from '../assets/logo.png'

function Navbar() {
  const [isOpen, setOpen] = useState(false);
  
  const nav_item = [
    { nom: 'ACCUEIL', ancre: 'accueil' },
    { nom: 'SERVICES', ancre: 'services' },
    { nom: 'GALERIE', ancre: 'galerie' },
    { nom: 'A PROPOS', ancre: 'a-propos' },
    { nom: 'CONTACT', ancre: 'contact' }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center ">
          <img src={logo} alt="Logo" className="h-20 w-auto ml-" />
          <span className="max-[423px]:hidden ">Smart pressing</span>
          
        </div>
        <Theme />

        {/* MENU DESKTOP (Caché sur mobile) */}
        <ul className="hidden md:flex items-center gap-8">
          {nav_item.map((item) => (
            <li key={item.nom}>     
              <a href={`#${item.ancre}`} className="text-brand-primary hover:text-brand-text transition-colors">
                {item.nom}
              </a>
            </li>
          ))}
        </ul>

        {/* BOUTON BURGER (Caché sur desktop) */}
        <button 
          onClick={() => setOpen(!isOpen)}
          className="md:hidden p-2 text-brand-primary"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {/* Si ouvert : Croix (X), sinon : Barres (Burger) */}
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* MENU MOBILE (S'affiche uniquement si isOpen est true) */}
      <div className={`${isOpen ? "flex" : "hidden"} md:hidden flex-col bg-brand-surface border-t border-brand-border absolute w-full left-0 shadow-lg`}>
        <ul className="flex flex-col p-6 gap-4 items-center">
          {nav_item.map((item) => (
            <li key={item.nom} className="">
              <a 
                href={`#${item.ancre}`} 
                onClick={() => setOpen(false)} // Ferme le menu après clic
                className="block text-lg font-medium text-brand-primary hover:text-brand-text"
              >
                {item.nom}
              </a>
            </li>
          ))}
        </ul>
      </div>

      
    </nav>
  );
}

export default Navbar;