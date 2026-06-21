import { useState, useEffect } from "react";

function WhatsAppButton() {
  // Changement d'état : devient true si on doit afficher le bouton
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // On récupère la hauteur exacte de la section Hero (100vh ou hauteur de fenêtre)
      const heroHeight = window.innerHeight;

      // Si le scroll dépasse la hauteur du Hero, on affiche le bouton. Sinon, on le cache.
      if (window.scrollY > heroHeight - 100) { // -100px pour anticiper légèrement la transition
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Exécution initiale au cas où la page est rafraîchie déjà scrollée
    handleScroll(); 

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`fixed left-6 transition-all duration-500 z-50 ${
        isVisible 
          ? "bottom-6 opacity-100 scale-100" 
          : "bottom-[-100px] opacity-0 scale-75 pointer-events-none" 
      }`}
    >
      <a 
        href="https://wa.me/243893994885" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Discuter avec nous sur WhatsApp"
        className="group flex items-center justify-center w-14 h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 rounded-full transition-all duration-300 transform hover:scale-110 cursor-pointer shadow-lg shadow-blue-500/10"
      >
        {/* Icône WhatsApp SVG */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-7 h-7 transition-transform duration-500 group-hover:rotate-[360deg]"
        >
          <path d="M12.031 2c-5.506 0-9.987 4.479-9.987 9.986 0 1.763.461 3.473 1.336 4.975L2 22l5.191-1.362c1.442.785 3.064 1.2 4.835 1.2l.005-.001c5.506 0 9.987-4.479 9.987-9.987 0-2.659-1.035-5.158-2.915-7.039C17.235 2.932 14.717 2 12.031 2zm4.567 14.004c-.25.701-1.448 1.282-2.001 1.362-.486.071-1.121.127-3.23-.746-2.695-1.114-4.437-3.855-4.572-4.035-.135-.18-1.096-1.458-1.096-2.781 0-1.323.676-1.973.916-2.241.24-.268.526-.335.701-.335.175 0 .35 0 .5.008.158.008.374-.06.586.45.22.531.751 1.831.816 1.966.065.135.109.293.02.472-.09.18-.135.293-.269.45-.134.157-.282.351-.403.471-.135.135-.276.282-.12.551.157.27.697 1.147 1.493 1.857.796.71 1.464.93 1.734 1.065.271.135.428.113.586-.068.158-.18.676-.788.856-1.058.18-.269.359-.225.607-.135.248.09 1.573.742 1.843.877.27.135.45.203.518.315.068.112.068.653-.182 1.354z" />
        </svg>
      </a>
    </div>
  );
}

export default WhatsAppButton;