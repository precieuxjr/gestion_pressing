import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Specialities from "../components/specialite";

export default function Expertise() {
  const sectionRef = useRef(null);
  // Un seuil (amount) à 0.15 est souvent plus fluide sur mobile
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  // Variants pour l'en-tête
  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // Variants pour le composant Specialities
  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.15, ease: [0.215, 0.610, 0.355, 1.000] },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 balance-edges"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de section */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={headerVariants}
          className="text-center mb-12 sm:mb-20"
        >
          <p className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm tracking-[0.25em] uppercase">
            Notre Expertise
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-white">
            Nos Spécialités
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg mt-4 font-normal">
            Un savoir-faire artisanal de haute technicité, dédié à la préservation et à l'éclat de vos pièces les plus précieuses.
          </p>
        </motion.div>

        {/* Contenu principal (Grille ou liste gérée par Specialities) */}
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