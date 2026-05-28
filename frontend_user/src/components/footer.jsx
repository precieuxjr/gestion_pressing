import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const titleVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const linkVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  const bottomVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.5 } },
  };

  const Nos_services = [
    { nom: 'Nettoyage à Sec', ancre: 'services' },
    { nom: 'Blanchisserie', ancre: 'services' },
    { nom: 'Retouches & Couture', ancre: 'services' },
    { nom: 'Repassage', ancre: 'services' },
    { nom: 'Livraison express', ancre: 'services' },
  ];

  const foot_item = [
    { nom: 'Accueil', ancre: 'accueil' },
    { nom: 'Services', ancre: 'services' },
    { nom: 'Galerie', ancre: 'galerie' },
    { nom: 'A propos', ancre: 'a-propos' },
    { nom: 'Contact', ancre: 'contact' },
  ];

  return (
    <footer ref={footerRef} className="bg-gray-300/30 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grille principale responsive avec animations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8"
        >
          {/* Description */}
          <motion.div variants={itemVariants}>
            <p className="text-sm text-gray-700">
              SMART PRESSING, votre partenaire de confiance pour le nettoyage à
              sec, la blanchisserie et les retouches à Kinshasa. Meilleur Ouvrier
              du Congo.
            </p>
            <div className="border-b border-gray-300 mt-3"></div>
          </motion.div>

          {/* Liens rapides */}
          <motion.div variants={itemVariants}>
            <div className="mb-3">
              <p className="font-bold text-gray-800">Liens Rapides</p>
              <div className="bg-blue-500 h-1 w-8 rounded-full"></div>
            </div>
            <ul className="flex flex-col gap-2">
              {foot_item.map((item, idx) => (
                <motion.li
                  key={item.nom}
                  variants={linkVariants}
                  custom={idx}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                >
                  <a
                    href={`#${item.ancre}`}
                    className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 text-blue-500 shrink-0 transition-transform group-hover:translate-x-1" />
                    {item.nom}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Nos services */}
          <motion.div variants={itemVariants}>
            <div className="mb-3">
              <p className="font-bold text-gray-800">Nos Services</p>
              <div className="bg-blue-500 h-1 w-8 rounded-full"></div>
            </div>
            <ul className="flex flex-col gap-2">
              {Nos_services.map((item, idx) => (
                <motion.li
                  key={item.nom}
                  variants={linkVariants}
                  custom={idx}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                >
                  <a
                    href={`#${item.ancre}`}
                    className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 text-blue-500 shrink-0 transition-transform group-hover:translate-x-1" />
                    {item.nom}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Connexion / Newsletter */}
          <motion.div variants={itemVariants}>
            <div className="mb-3">
              <h2 className="font-bold text-gray-800">CONNECTEZ-VOUS</h2>
              <div className="bg-blue-500 h-1 w-8 rounded-full"></div>
            </div>
            <form className="flex flex-col gap-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="exemple@gmail.com"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  placeholder="••••••"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <input
                type="submit"
                value="Connexion"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition cursor-pointer"
              />
              <p className="text-xs text-gray-500">
                Vous n'avez pas de compte ?{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  S'inscrire
                </a>
              </p>
            </form>
          </motion.div>
        </motion.div>

        {/* Bas de page animé */}
        <motion.div
          variants={bottomVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col md:flex-row justify-between items-center gap-3 pt-6 border-t border-gray-300 text-xs text-gray-500"
        >
          <p>Smart Pressing by JS and KAZMAN. Tous droits réservés.</p>
          <p>Conditions d'utilisation | Politique de confidentialité</p>
          <p>Meilleur Ouvrier du Congo - Kinshasa, RDC</p>
        </motion.div>
      </div>
    </footer>
  );
}