import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Phone, MapPin } from 'lucide-react';
import IconFacebook from '../components/btnfacebook';
import IconInstagram from '../components/btninstagram';
import IconTiktok from '../components/btntiktok';

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#25D366"
    width="24"
    height="24"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412 0 12.048c0 2.12.554 4.189 1.605 6.04L0 24l6.117-1.605a11.803 11.803 0 005.925 1.585h.005c6.637 0 12.05-5.414 12.053-12.052a11.85 11.85 0 00-3.51-8.49z" />
  </svg>
);

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const headerVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const formVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } },
  };

  const infoVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } },
  };

  const info = [
    {
      id: 1,
      nom: 'Adresse',
      description: 'Avenue Père Boka N°2, ISP-Gombe, Kinshasa Gombe, RDC',
      i_cone: MapPin,
    },
    {
      id: 2,
      nom: 'Téléphone',
      description: '+243 893994885',
      i_cone: Phone,
    },
    {
      id: 3,
      nom: 'Horaires',
      description: 'Lun - Ven: 7h00 - 20h00 , Sam: 8h00 - 18h00 | Dim: Fermé',
      i_cone: Clock,
    },
    {
      id: 4,
      nom: 'WhatsApp',
      description: 'Réponse rapide garantie',
      i_cone: WhatsAppIcon,
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Données envoyées :', formData);
    alert(
      `Merci ${formData.nom}, votre demande pour le service ${formData.service} a été reçue !`
    );
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
          <h3 className="text-blue-500 font-bold text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            CONTACT
          </h3>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mt-2">
            CONTACTEZ-NOUS
          </h1>
          <div className="w-20 sm:w-24 h-1 bg-yellow-500 mx-auto my-4 rounded-full"></div>
          <p className="text-gray-500 text-sm sm:text-base">
            Une question ? Un devis ? N'hésitez pas à nous contacter
          </p>
        </motion.div>

        {/* Contenu principal : formulaire + infos */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Formulaire animé */}
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            onSubmit={handleSubmit}
            className="flex-1 bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Jean Kalenga"
                  className="w-full p-3 rounded-lg bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  placeholder="+243..."
                  className="w-full p-3 rounded-lg bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="w-full p-3 rounded-lg bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service souhaité
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-50 text-gray-700 border border-gray-200"
              >
                <option value="nettoyage">Nettoyage à sec</option>
                <option value="blanchisserie">Blanchisserie</option>
                <option value="retouche">Retouche</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Détails de votre commande..."
                rows="4"
                className="w-full p-3 rounded-lg bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition duration-200"
            >
              Envoyer la demande
            </button>
          </motion.form>

          {/* Infos de contact animées */}
          <motion.div
            variants={infoVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex-1 bg-white rounded-2xl shadow-md p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
              Informations de Contact
            </h2>
            <div className="space-y-5">
              {info.map((item) => {
                const Icon = item.i_cone;
                return (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 mt-1">
                      {item.nom === 'WhatsApp' ? (
                        <Icon />
                      ) : (
                        <Icon className="text-blue-500 w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {item.nom}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {item.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            <div>
              <p className="font-semibold text-gray-900 mb-3">Suivez-nous</p>
              <div className="flex flex-wrap gap-4">
                <IconFacebook />
                <IconInstagram />
                <WhatsAppIcon />
                <IconTiktok />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}