import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import nettoyage from '../assets/services/nettoyage a sec.webp';
import blachisserie from '../assets/services/blanchisserie.webp';
import retouche from '../assets/services/retouche.jpg';
import livraison from '../assets/services/livraison.png';
import repassage from '../assets/services/repassage.png';
import Service_entreprise from '../assets/services/SERVICE_entreprise.jpg';
// Import d'icônes adaptées pour casser le côté générique
import { Sparkles, Shirt, Scissors, Check, Waves, Truck, Briefcase } from 'lucide-react';

export default function Services() {
  const services_premium = [
    {
      id: 1,
      nom: 'Nettoyage à sec',
      description: 'Nettoyage professionnel pour costumes, robes de soirée et textiles délicats avec des produits premium.',
      image: nettoyage,
      objectif: ['Costumes & Tailleurs', 'Robes de soirée', 'Textiles délicats'],
      icone: Sparkles,
    },
    {
      id: 2,
      nom: 'Blanchisserie',
      description: 'Du linge impeccable, parfaitement lavé, repassé et plié. Service pour particuliers et professionnels.',
      image: blachisserie,
      objectif: ['Chemises & Pantalons', 'Linge de maison', 'Service B2B'],
      icone: Shirt,
    },
    {
      id: 3,
      nom: 'Retouche & Couture',
      description: 'Ajustements, réparations et modifications par des mains expertes. Redonnez vie à vos vêtements.',
      image: retouche,
      objectif: ['Ajustements sur mesure', 'Réparations', 'Modifications créatives'],
      icone: Scissors,
    },
    {
      id: 4,
      nom: 'Repassage',
      description: 'Repassage professionnel sur table aspirante et soufflante pour un fini impeccable, sans faux plis.',
      image: repassage,
      objectif: ['Chemises & Pantalons', 'Draps & Nappes', 'Service rapide'],
      icone: Waves,
    },
    {
      id: 5,
      nom: 'Livraison Express',
      description: 'Nous récupérons vos vêtements à domicile et vous les retournons propres et emballés dans les meilleurs délais.',
      image: livraison,
      objectif: ['Récupération à domicile', 'Livraison express à Kinshasa'],
      icone: Truck,
    },
    {
      id: 6,
      nom: 'Service Entreprise',
      description: "Prise en charge globale et entretien d'uniformes, nappes, serviettes et linge professionnel.",
      image: Service_entreprise,
      objectif: ['Hôtels & Hébergements', 'Restaurants & Cafés', 'Salles de sport & Spas'],
      icone: Briefcase,
    },
  ];

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.2 });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.215, 0.610, 0.355, 1.000] } },
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="py-16 sm:py-24 min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de section */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          variants={headerVariants}
          className="text-center mb-12 sm:mb-20"
        >
          <p className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm tracking-[0.25em] uppercase">
            Savoir-faire & Qualité
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-white">
            Nos Services Premium
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-base sm:text-lg mt-4 font-normal">
            Des prestations artisanales et modernes pour prendre soin de votre garde-robe avec la plus grande délicatesse.
          </p>
        </motion.div>

        {/* Grille de cartes */}
        <motion.div
          ref={gridRef}
          variants={containerVariants}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services_premium.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeInOut' } }}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-52 sm:h-56 w-full overflow-hidden group">
                <img
                  src={service.image}
                  alt={service.nom}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Badge Premium flottant */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
                  <service.icone className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-bold text-white tracking-wider uppercase">
                    {service.nom}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2 capitalize">
                    {service.nom}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5">
                    {service.description}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                  {service.objectif.map((obj, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="p-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 shrink-0">
                        <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">{obj}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}