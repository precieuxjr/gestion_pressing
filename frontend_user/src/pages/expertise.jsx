import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Specialities from "../components/specialite";

export default function Expertise() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Variants pour l'en-tête
  const headerVariants = {
    hidden: { y: -40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // Variants pour le composant Specialities
  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 lg:py-24 min-h-screen"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête animé */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={headerVariants}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-blue-500 font-bold text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            NOTRE EXPERTISE
          </h2>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mt-2">
            NOS SPÉCIALITÉS
          </h1>
          <div className="w-20 sm:w-24 h-1 bg-yellow-500 mx-auto my-4 sm:my-6 rounded-full" />
          <p className="text-gray-500 italic max-w-2xl mx-auto text-sm sm:text-base px-4">
            Un savoir-faire unique reconnu par le titre de Meilleur Ouvrier du Congo
          </p>
        </motion.div>

        {/* Contenu principal animé */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={contentVariants}
        >
          <Specialities />
        </motion.div>
      </div>
    </section>
  );
}