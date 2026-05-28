import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import nettoyage from '../assets/services/nettoyage a sec.webp';
import blachisserie from '../assets/services/blanchisserie.webp';
import retouche from '../assets/services/retouche.jpg';
import livraison from '../assets/services/livraison.png';
import repassage from '../assets/services/repassage.png';
import Service_entreprise from '../assets/services/SERVICE_entreprise.jpg';
import { Sparkles, Shirt, Scissors, Check } from 'lucide-react';

export default function Services() {
  const services_premium = [
    {
      id: 1,
      nom: 'nettoyage à sec',
      description:
        'Nettoyage professionnel pour costumes robes de soirée et textiles délicats avec des produits premium.',
      image: nettoyage,
      objectif: ['Costumes & Tailleurs', 'Robes de soirée', 'Textiles délicats'],
      icone: Sparkles,
    },
    {
      id: 2,
      nom: 'blanchisserie',
      description:
        'Du linge impeccable, parfaitement lavé, repassé et plié. Service pour particuliers et professionnels.',
      image: blachisserie,
      objectif: ['Chemises & Pantalons', 'Linge de maison', 'Service B2B'],
      icone: Shirt,
    },
    {
      id: 3,
      nom: 'retouche & couture',
      description:
        'Ajustements, réparations et modifications par des mains expertes. Redonnez vie à vos vêtements.',
      image: retouche,
      objectif: ['Ajustements sur mesure', 'Réparations', 'Modifications créatives'],
      icone: Scissors,
    },
    {
      id: 4,
      nom: 'repassage',
      description:
        'Repassage professionnel pour un fini impeccable, sans faux plis.',
      image: repassage,
      objectif: ['Chemises & Pantalons', 'Draps & Nappes', 'Service rapide'],
      icone: Scissors,
    },
    {
      id: 5,
      nom: 'livraison',
      description:
        'Nous récupérons vos vêtements à domicile et vous les retournons propres et emballés dans les meilleurs délais.',
      image: livraison,
      objectif: ['Récupération à domicile', 'Livraison express',],
      icone: Scissors,
    },
    {
      id: 6,
      nom: 'Service entreprise',
      description:
        "Entretien d'uniforme, nappe, serviette et linge professionnel.",
      image: Service_entreprise,
      objectif: ['Hôtels', 'Restaurant', 'Salle de sport'],
      icone: Scissors,
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
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const headerVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* En‑tête animé */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          variants={headerVariants}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <p className="text-blue-500 font-bold text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            CE QUE NOUS OFFRONS
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mt-2">
            NOS DIFFÉRENTS SERVICES
          </h1>
          <div className="w-20 sm:w-24 h-1 bg-yellow-500 mx-auto my-4 sm:my-6 rounded-full" />
          <p className="text-gray-500 italic max-w-2xl mx-auto text-sm sm:text-base px-4">
            Des services professionnels pour prendre soin de vos vêtements avec
            expertise et délicatesse.
          </p>
        </motion.div>

        {/* Grille de cartes avec animation stagger */}
        <motion.div
          ref={gridRef}
          variants={containerVariants}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {services_premium.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-gray-100 rounded-t-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 sm:h-52 md:h-56 w-full overflow-hidden group">
                <img
                  src={service.image}
                  alt={service.nom}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-2 left-2 flex flex-row items-center bg-black/50 rounded-full px-2 py-1 backdrop-blur-sm">
                  <service.icone className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white ml-1 uppercase">
                    {service.nom}
                  </span>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-5">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
                  {service.description}
                </p>
                <div className="space-y-1">
                  {service.objectif.map((obj, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-gray-600 text-sm">{obj}</p>
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