import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles } from 'lucide-react';
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
    nom_re: 'Costume Homme',
    description: 'Détachage ciblé et pressage structurel complet.',
  },
  {
    id: 2,
    im_avant: robe_avant,
    im_apres: robe_apres,
    categorie: 'Blanchisserie',
    nom_re: 'Robe de Soirée',
    description: 'Nettoyage délicat des fibres et repassage haute finition.',
  },
  {
    id: 3,
    im_avant: chemise_avant,
    im_apres: chemise_apres,
    categorie: 'Repassage',
    nom_re: 'Chemises Blanches',
    description: 'Blanchiment protecteur et alignement des cols pro.',
  },
];

export default function Galerie() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* EN-TÊTE DE SECTION */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={headerVariants}
          className="text-center mb-12 sm:mb-20"
        >
          <p className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm tracking-[0.25em] uppercase">
            Nos Réalisations
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-white">
            Le Résultat en Images
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base mt-4 font-normal">
            Survolez ou touchez les cartes pour révéler l'éclat après notre traitement professionnel.
          </p>
        </motion.div>

        {/* GRILLE DES COMPARAISONS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {realisation.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* ZONE DU CADRE PHOTO */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                {/* Image Avant */}
                <img
                  src={item.im_avant}
                  alt={`${item.nom_re} avant traitement`}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
                  loading="lazy"
                />
                {/* Image Après */}
                <img
                  src={item.im_apres}
                  alt={`${item.nom_re} après traitement`}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                  loading="lazy"
                />
                
                {/* BADGES INDICATEURS DYNAMIQUES */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider group-hover:hidden transition-all">
                    Avant
                  </span>
                  <span className="hidden bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider group-hover:inline-block transition-all">
                    Après
                  </span>
                </div>

                {/* Petite étiquette incitative discrète au pied de l'image */}
                <div className="absolute bottom-3 right-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm px-2 py-1 rounded-md text-[9px] text-slate-500 dark:text-slate-400 font-medium tracking-wide pointer-events-none transition-opacity group-hover:opacity-0">
                  Survolez pour voir
                </div>
              </div>

              {/* DETAILS ET LEGENDES */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {item.categorie}
                  </span>
                </div>
                
                <h3 className="text-slate-900 dark:text-white text-lg font-bold mt-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.nom_re}
                </h3>
                
                <p className="text-slate-400 dark:text-slate-400 text-xs sm:text-sm mt-1.5 font-normal leading-relaxed">
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