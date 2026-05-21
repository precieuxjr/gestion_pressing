
import WhatsAppButton from '../components/btnwhatsApp';
import Commanderbtn from '../components/btncommander';
import {motion } from 'framer-motion'


export default function Hero() {
  const slogan = "L'EXCELLENCE DU PRESSING À KINSHASA";

  return (
    <section className="flex flex-col max-w-7xl mx-auto px-6 items-center justify-center mt-24">
  
      <motion.h1
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-7xl font-bold mb-6 text-center max-[524px]:text-5xl max-[351px]:text-4xl"
      >
        {slogan}
      </motion.h1>

     
      <ul className="flex flex-rows justify-center items-center gap-3 list-disc list-inside mb-8">
        <li className="marker:text-blue-500 font-medium">Nettoyage à sec</li>
        <li className="marker:text-blue-500 font-medium">Blanchisserie</li>
        <li className="marker:text-blue-500 font-medium">Retouche</li>
      </ul>


      <div className="flex flex-col gap-4 justify-center w-full items-center">
  
        <button className="group flex items-center justify-center gap-3 w-full max-w-xs px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20 cursor-pointer">
          <span>Découvrir nos services</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </button>

      
        <button className="group flex items-center justify-center gap-3 w-full max-w-xs px-8 py-4 bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-full transition-all duration-300 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
            />
          </svg>
          <span>Contactez-nous</span>
        </button>
      </div>

      <WhatsAppButton />
      
      <Commanderbtn  />
   
    </section>
  );
}