import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Phone, MapPin, Send } from 'lucide-react';
import IconFacebook from '../components/btnfacebook';
import IconInstagram from '../components/btninstagram';
import IconTiktok from '../components/btntiktok';

const WhatsAppIcon = ({ className = "w-5 h-5", fill = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412 0 12.048c0 2.12.554 4.189 1.605 6.04L0 24l6.117-1.605a11.803 11.803 0 005.925 1.585h.005c6.637 0 12.05-5.414 12.053-12.052a11.85 11.85 0 00-3.51-8.49z" />
  </svg>
);

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const formVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.15 } },
  };

  const infoVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.15 } },
  };

  const info = [
    {
      id: 1,
      nom: 'Adresse',
      description: 'Avenue Père Boka N°2, ISP-Gombe, Kinshasa Gombe, RDC',
      icon: MapPin,
      iconColor: 'text-blue-500 dark:text-blue-400',
    },
    {
      id: 2,
      nom: 'Téléphone',
      description: '+243 893994885',
      icon: Phone,
      iconColor: 'text-blue-500 dark:text-blue-400',
    },
    {
      id: 3,
      nom: 'Horaires',
      description: 'Lun - Ven: 7h00 - 20h00 , Sam: 8h00 - 18h00 | Dim: Fermé',
      icon: Clock,
      iconColor: 'text-blue-500 dark:text-blue-400',
    },
    {
      id: 4,
      nom: 'WhatsApp',
      description: 'Réponse rapide et devis instantané garantis',
      icon: WhatsAppIcon,
      iconColor: 'text-emerald-500 dark:text-emerald-400',
    },
  ];

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    numero: '',
    service: 'blanchisserie',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Données envoyées :', formData);
    alert(`Merci ${formData.nom}, votre demande pour le service ${formData.service} a été reçue !`);
  };

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* EN-TÊTE DE SECTION */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={headerVariants}
          className="text-center mb-12 sm:mb-20"
        >
          <p className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm tracking-[0.25em] uppercase">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-slate-900 dark:text-white">
            Contactez-Nous
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base mt-4 font-normal">
            Une question ? Un devis spécifique ? Notre équipe vous répond dans les plus brefs délais.
          </p>
        </motion.div>

        {/* GRILLE PRINCIPALE */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          
          {/* FORMULAIRE DE CONTACT */}
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            onSubmit={handleSubmit}
            className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm p-6 sm:p-10 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Jean Kalenga"
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none border border-slate-200/80 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="numero"
                  required
                  value={formData.numero}
                  onChange={handleChange}
                  placeholder="+243..."
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none border border-slate-200/80 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none border border-slate-200/80 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Service souhaité
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm"
              >
                <option value="nettoyage">Nettoyage à sec</option>
                <option value="blanchisserie">Blanchisserie</option>
                <option value="retouche">Retouche &amp; Ajustements</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Message
              </label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Détails concernant vos vêtements ou instructions particulières..."
                rows="4"
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none border border-slate-200/80 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl font-bold transition duration-200 text-sm shadow-md shadow-blue-600/10"
            >
              <Send size={16} />
              <span>Envoyer la demande</span>
            </button>
          </motion.form>

          {/* INFORMATIONS COMPLÉMENTAIRES */}
          <motion.div
            variants={infoVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-sm p-6 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Informations Utiles
              </h3>
              
              <div className="space-y-6">
                {info.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.id} className="flex gap-4 items-start group">
                      <div className={`flex-shrink-0 mt-0.5 p-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg ${item.iconColor}`}>
                        {item.nom === 'WhatsApp' ? (
                          <IconComponent fill="currentColor" />
                        ) : (
                          <IconComponent size={20} strokeWidth={2} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white tracking-wide">
                          {item.nom}
                        </h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 leading-relaxed font-normal">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BLOC RÉSEAUX SOCIAUX */}
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                Rejoignez-nous sur les réseaux
              </p>
              <div className="flex flex-wrap gap-3.5 text-slate-600 dark:text-slate-400">
                <IconFacebook className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                <IconInstagram className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors" />
                <WhatsAppIcon className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer w-6 h-6" fill="currentColor" />
                <IconTiktok className="hover:text-black dark:hover:text-white transition-colors" />
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}