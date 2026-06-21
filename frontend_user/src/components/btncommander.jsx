import { Link } from "react-router-dom";

export default function Commanderbtn() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link 
        to="/selection" 
        className="group flex items-center justify-center gap-2.5 p-3.5 sm:px-6 sm:py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl dark:shadow-blue-600/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        aria-label="Passer une commande"
      >
        {/* Icône de Panier */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2.2} 
          stroke="currentColor" 
          className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" 
          />
        </svg>
        
        {/* Texte masqué sur mobile/tablette, visible à partir des grands écrans */}
        <span className="uppercase tracking-wider text-xs sm:text-sm hidden lg:inline-block">
          Commander
        </span>
      </Link>
    </div>
  );
}