import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Check, Clock, Smile } from 'lucide-react';
import im_personnel from '../assets/services/nettoyage a sec.webp';

const avantages = [
  {
    id: 1,
    icon: Star,
    color: 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
    nom: 'Meilleur Ouvrier',
    description: 'Expertise officiellement reconnue au Congo.',
  },
  {
    id: 2,
    icon: Check,
    color: 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
    nom: 'Qualité Premium',
    description: 'Produits écoresponsables et soins haut de gamme.',
  },
  {
    id: 3,
    icon: Clock,
    color: 'text-sky-500 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30',
    nom: 'Service Rapide',
    description: 'Prise en charge et délais scrupuleusement respectés.',
  },
  {
    id: 4,
    icon: Smile,
    color: 'text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30',
    nom: 'Satisfaction Garantie',
    description: 'Votre garde-robe entre des mains d’orfèvres.',
  },
];

export default function Apropos() {
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
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const imageVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const badgeVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.4, ease: 'easeOut' } },
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 py-16 sm:py-24 balance-edges"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* BLOC GAUCHE : TEXTE & CARACTÉRISTIQUES */}
        <div className="flex-1 w-full">
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={headerVariants}
          >
            <p className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm tracking-[0.25em] uppercase">
              Notre Histoire
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-white">
              Qui Sommes-Nous ?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base mt-4 leading-relaxed font-normal text-justify">
              Notre engagement indéfectible envers l'excellence, notre rigueur artisanale et notre passion 
              pour le traitement des textiles précieux font de Smart Pressing le choix privilégié des Kinois exigeants.
            </p>
          </motion.div>

          {/* GRILLE DES AVANTAGES */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
          >
            {avantages.map((item) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  className="flex flex-row items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className={`flex-shrink-0 p-3 rounded-xl transition-transform duration-300 group-hover:scale-105 ${item.color}`}>
                    <IconComponent size={22} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white text-sm font-bold tracking-wide">
                      {item.nom}
                    </h4>
                    <p className="text-slate-400 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* BLOC DROITE : ILLUSTRATION & BADGE D'EXPÉRIENCE */}
        <div className="flex-1 w-full flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md aspect-square lg:aspect-auto">
            <motion.img
              variants={imageVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              src={im_personnel}
              alt="Atelier et personnel Smart Pressing"
              className="rounded-3xl w-full h-full object-cover border border-slate-200/40 dark:border-slate-800 shadow-md"
              loading="lazy"
            />
            
            {/* BADGE FLOTTANT D'EXPÉRIENCE */}
            <motion.div
              variants={badgeVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 flex items-center bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white p-5 rounded-2xl shadow-xl min-w-[260px] sm:min-w-[280px]"
            >
              <div className="pr-4 sm:pr-5 border-r border-slate-800 dark:border-slate-700">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-blue-500">5+</span>
              </div>
              <div className="pl-4 sm:pl-5">
                <h4 className="text-blue-400 dark:text-blue-400 text-sm sm:text-base font-bold leading-snug">
                  Années d'expérience
                </h4>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mt-0.5">
                  Au service de Kinshasa
                </p>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}