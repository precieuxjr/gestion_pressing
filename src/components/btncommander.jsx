 export default function Commanderbtn () {
 
 
 
 return (<div className="absolute bottom-8 right-6">
    <a 
      href="https://wa.me/243XXXXXXXXX?text=Bonjour%20Smart%20Pressing,%20je%20souhaite%20passer%20une%20commande." 
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      {/* Icône de Panier */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={2} 
        stroke="currentColor" 
        className="w-6 h-6 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
      
      <span className="uppercase tracking-wide text-sm   max-[1029px]:hidden    ">Commander</span>
    </a>
  </div>)
 }