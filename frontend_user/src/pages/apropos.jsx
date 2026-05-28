import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Check, Clock, Smile } from 'lucide-react';
import im_personnel from '../assets/services/nettoyage a sec.webp';

export default function Apropos() {
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
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const badgeVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3, ease: 'easeOut' } },
  };

  const avantages = [
    {
      id: 1,
      icone: <Star size={30} strokeWidth={1.5} />,
      couleur: 'text-yellow-400',
      nom: 'Meilleur Ouvrier',
      description: 'Expertise officiellement reconnue au Congo',
    },
    {
      id: 2,
      icone: <Check size={30} strokeWidth={1.5} />,
      couleur: 'text-blue-400',
      nom: 'Qualité Premium',
      description: 'Produits et équipements haut de gamme',
    },
    {
      id: 3,
      icone: <Clock size={30} strokeWidth={1.5} />,
      couleur: 'text-blue-400',
      nom: 'Service Rapide',
      description: 'Délais toujours respectés',
    },
    {
      id: 4,
      icone: <Smile size={30} strokeWidth={1.5} />,
      couleur: 'text-yellow-400',
      nom: 'Satisfaction Garantie',
      description: 'Votre bonheur, notre priorité',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20"
    >
      {/* Partie gauche */}
      <div className="flex-1">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={headerVariants}
        >
          <p className="text-blue-500 font-bold text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            NOTRE HISTOIRE
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter mt-2">
            QUI SOMMES‑NOUS ?
          </h1>
          <div className="w-10 h-1 bg-amber-300 my-3 rounded-full"></div>
          <p className="text-gray-600 text-sm sm:text-base text-justify">
            Notre engagement envers l'excellence et notre passion pour le métier
            font de Smart Pressing le choix privilégié des Kinois exigeants.
          </p>
        </motion.div>

        {/* Grille des avantages animée en cascade */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"
        >
          {avantages.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="flex flex-row items-center gap-3 p-3 bg-white/80 rounded-xl shadow-md"
            >
              <div className="p-2 border border-gray-200 rounded-full bg-gray-50">
                <span className={item.couleur}>{item.icone}</span>
              </div>
              <div>
                <p className="text-blue-500 text-base font-semibold">{item.nom}</p>
                <div className="w-6 h-0.5 bg-amber-300 my-1"></div>
                <p className="text-gray-500 text-xs sm:text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Partie droite : image animée + badge */}
      <div className="flex-1 flex justify-center">
        <div className="relative inline-block w-full max-w-md">
          <motion.img
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            src={im_personnel}
            alt="Personnel Smart Pressing"
            className="rounded-2xl w-full h-auto object-cover shadow-lg"
          />
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 flex items-center bg-gray-900 text-white p-4 sm:p-5 rounded-2xl shadow-2xl min-w-[260px] sm:min-w-[300px]"
          >
            <div className="pr-4 sm:pr-6 border-r border-gray-700">
              <span className="text-2xl sm:text-3xl font-black">5+</span>
            </div>
            <div className="pl-4 sm:pl-6">
              <h4 className="text-blue-300 text-base sm:text-lg font-bold leading-tight">
                Années d'expérience
              </h4>
              <p className="text-gray-400 text-xs sm:text-sm font-medium mt-1">
                Au service de Kinshasa
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}