import { useState } from 'react';
import { Clock,Phone, MapPin } from 'lucide-react';
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
    <section>
      <div className="flex flex-col items-center">
        <h3 className="py-2 text-blue-500 font-bold text-sm tracking-[0.3em]">
          CONTACT
        </h3>
        <h1 className="text-[#111111]  text-4xl md:text-5xl font-black uppercase tracking-tighter">
          CONTACTEZ-NOUS
        </h1>
        <div className="w-24 h-1 bg-yellow-500 mx-auto my-4"></div>
        <p className="text-gray-400">
          Une question ? Un devis ? N'hésitez pas à nous contacter
        </p>
      </div>

      <div className=" grid-cols-2 flex flex-row py-4 px-20 gap-10">
        <form
          onSubmit={handleSubmit}
          className=" bg-transparent  rounded-2xl flex flex-col gap-4 w-150   "
        >
          <div className="flex flex-row gap-10">
            <div className="flex flex-col m">
              <label htmlFor="nom">Nom complet</label>
              <input
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Jhon Kalenga "
                className="p-3 w-70 rounded bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              />{' '}
            </div>

            <div className="flex flex-col">
              <label htmlFor="numero">Téléphone</label>
              <input
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="+243..."
                className="p-3  w-70 rounded bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="p-3 rounded bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="service">Service souhaité</label>

            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="p-3 rounded bg-gray-50 text-gray-700"
            >
              <option value="nettoyage">Nettoyage à sec</option>
              <option value="blanchisserie">Blanchisserie</option>
              <option value="retouche">Retouche</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="message">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Détails de votre commande..."
              className="p-3 rounded bg-gray-50 text-gray-700 h-20"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-gray-50 p-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Envoyer la demande
          </button>
        </form>

        <div className="bg-transparent ">
          <h2 className="font-bold text-2xl ">Informations de Contact</h2>

          <div>
            {info.map((item) => {
              const Icon = item.i_cone;

              return (
                <div
                  key={item.id}
                  className="flex flex-row gap-4 py-2
              my-3"
                >
                  <div>
                    <Icon
                      className={
                        item.nom === 'WhatsApp' ? '' : 'text-blue-500 w-6 h-6'
                      }
                      size={24}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="font-bold">{item.nom}</div>
                    <div>{item.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-b border-gray-300"></div>
          <div className="my-4">
            <p className="font-bold">Suivez-nous</p>
            <div className='flex flex-row gap-10 py-6 '>
              <IconFacebook />
              <IconInstagram />
              <WhatsAppIcon />
              <IconTiktok />
            
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
