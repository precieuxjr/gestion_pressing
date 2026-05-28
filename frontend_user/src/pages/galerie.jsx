import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import chemise_avant from '../assets/galerie/3 avant.png';
import chemise_apres from '../assets/galerie/3 apres.png';
import robe_avant from '../assets/galerie/robe avant.png';
import robe_apres from '../assets/galerie/robe apres.png';
import veste_avant from '../assets/galerie/veste avant.png';
import veste_apres from '../assets/galerie/veste apres.png';

const realisation = [
  {
    id: 1,
    im_avant: veste_avant,
    im_apres: veste_apres,
    categorie: 'Nettoyage à sec',
    nom_re: 'Costume homme',
    description: 'Détachage et pressing complet',
  },
  {
    id: 2,
    im_avant: robe_avant,
    im_apres: robe_apres,
    categorie: 'Blanchisserie',
    nom_re: 'Robe de soirée',
    description: 'Nettoyage délicat et repassage',
  },
  {
    id: 3,
    im_avant: chemise_avant,
    im_apres: chemise_apres,
    categorie: 'Repassage',
    nom_re: 'Chemises blanches',
    description: 'Blanchisserie et repassage pro',
  },
];

export default function Galerie() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const headerVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête animé */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={headerVariants}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-blue-500 font-bold text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            NOS RÉALISATIONS
          </h2>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mt-2">
            GALERIE{' '}
            <span className="text-amber-500">AVANT</span>/
            <span className="text-blue-600">APRÈS</span>
          </h1>
          <div className="w-20 sm:w-24 h-1 bg-yellow-500 mx-auto my-4 sm:my-6 rounded-full"></div>
          <p className="text-gray-500 italic max-w-2xl mx-auto text-sm sm:text-base px-4">
            Survolez les images pour voir la transformation
          </p>
        </motion.div>

        {/* Grille avec animation stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto"
        >
          {realisation.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden bg-gray-100">
                <img
                  src={item.im_avant}
                  alt="Avant"
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                <img
                  src={item.im_apres}
                  alt="Après"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                  <span className="bg-blue-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full uppercase group-hover:hidden">
                    Avant
                  </span>
                  <span className="hidden bg-amber-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full uppercase group-hover:block">
                    Après
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-5 md:p-6">
                <span className="text-[10px] sm:text-xs font-bold border border-gray-300 border-b-amber-300 border-r-amber-300 rounded-2xl px-2 py-1">
                  {item.categorie.toUpperCase()}
                </span>
                <h3 className="text-blue-500 text-xl sm:text-2xl font-bold mt-2 sm:mt-3">
                  {item.nom_re}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}