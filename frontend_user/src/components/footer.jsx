import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HashLink } from 'react-router-hash-link';

export default function Footer() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.1 });

  // Animations subtiles et globales
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, duration: 0.6, ease: [0.215, 0.610, 0.355, 1.000] },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const services = [
    { nom: 'Nettoyage à Sec', ancre: 'services' },
    { nom: 'Blanchisserie', ancre: 'services' },
    { nom: 'Retouches & Couture', ancre: 'services' },
    { nom: 'Repassage', ancre: 'services' },
    { nom: 'Livraison Express', ancre: 'services' },
  ];

  const navigation = [
    { nom: 'Accueil', ancre: 'accueil' },
    { nom: 'Nos Services', ancre: 'services' },
    { nom: 'La Galerie', ancre: 'galerie' },
    { nom: 'À Propos', ancre: 'a-propos' },
    { nom: 'Contact', ancre: 'contact' },
  ];

  return (
    <footer ref={footerRef} className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grille Asymétrique : Plus d'espace pour la marque */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-12 border-b border-slate-800"
        >
          {/* Identité de marque (Prend 2 colonnes sur grand écran) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            <span className="text-xl font-bold tracking-tight text-white block">
              SMART PRESSING<span className="text-blue-500">.</span>
            </span>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Votre partenaire de confiance pour le soin de votre garde-robe. 
              Un savoir-faire d'excellence récompensé Meilleur Ouvrier du Congo à Kinshasa.
            </p>
          </motion.div>

          {/* Liens rapides */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Navigation</h3>
            <ul className="space-y-2.5">
              {navigation.map((item) => (
                <li key={item.nom}>
                  <HashLink
                    smooth
                    to={`/#${item.ancre}`}
                    className="inline-block text-sm text-slate-400 hover:text-white transform hover:translate-x-1 transition-all duration-200 ease-out"
                  >
                    {item.nom}
                  </HashLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Nos services */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Expertises</h3>
            <ul className="space-y-2.5">
              {services.map((item) => (
                <li key={item.nom}>
                  <HashLink
                    smooth
                    to={`/#${item.ancre}`}
                    className="inline-block text-sm text-slate-400 hover:text-white transform hover:translate-x-1 transition-all duration-200 ease-out"
                  >
                    {item.nom}
                  </HashLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Espace Client / Newsletter Épuré */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Restons connectés</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inscrivez-vous pour suivre nos offres exclusives et conseils d'entretien.
            </p>
            <form className="mt-2 space-y-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  className="w-full px-3.5 py-2 text-sm bg-slate-800 text-white placeholder-slate-500 border border-transparent rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 cursor-pointer shadow-sm shadow-blue-900/20"
              >
                S'abonner
              </button>
            </form>
          </motion.div>
        </motion.div>

        {/* Bas de page (Footer Bar) */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 text-center sm:text-left"
        >
          <div>
            <p>© {new Date().getFullYear()} Smart Pressing. Tous droits réservés.</p>
            <p className="mt-1 text-slate-600">Meilleur Ouvrier du Congo — Kinshasa, RDC</p>
          </div>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          </div>
        </motion.div>

      </div>
    </footer>
  );
}