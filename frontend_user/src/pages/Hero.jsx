import WhatsAppButton from '../components/btnwhatsApp';
import Commanderbtn from '../components/btncommander';
import { motion } from 'framer-motion';

export default function Hero() {
  const slogan = "L'EXCELLENCE DU PRESSING À KINSHASA";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const titleVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
  };

  const simpleFade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, delay: 0.5 } },
  };

  return (
    <section className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 items-center justify-center mt-16 sm:mt-20 md:mt-24">
      {/* Prise en charge du titre en mode sombre */}
      <motion.h1
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 text-center text-slate-900 dark:text-white"
      >
        {slogan}
      </motion.h1>

      {/* Prise en charge de la liste en mode sombre */}
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 list-disc list-inside mb-6 sm:mb-8 text-slate-700 dark:text-slate-300"
      >
        <motion.li variants={itemVariants} className="marker:text-blue-500 font-medium text-sm sm:text-base">Nettoyage à sec</motion.li>
        <motion.li variants={itemVariants} className="marker:text-blue-500 font-medium text-sm sm:text-base">Blanchisserie</motion.li>
        <motion.li variants={itemVariants} className="marker:text-blue-500 font-medium text-sm sm:text-base">Retouche</motion.li>
      </motion.ul>

      <div className="flex flex-col gap-3 sm:gap-4 justify-center w-full items-center">
        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          className="group flex items-center justify-center gap-3 w-full max-w-xs px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold rounded-full shadow-md cursor-pointer text-sm sm:text-base"
        >
          <span>Découvrir nos services</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </motion.button>

        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          className="group flex items-center justify-center gap-3 w-full max-w-xs px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white font-semibold rounded-full transition-all duration-200 cursor-pointer text-sm sm:text-base"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
          <span>Contactez-nous</span>
        </motion.button>
      </div>

      <motion.div variants={simpleFade} initial="hidden" animate="visible">
        <WhatsAppButton />
      </motion.div>
      <motion.div variants={simpleFade} initial="hidden" animate="visible">
        <Commanderbtn />
      </motion.div>
    </section>
  );
}