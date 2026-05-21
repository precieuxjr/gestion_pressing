import nettoyage from '../assets/services/nettoyage a sec.webp';
import blachisserie from '../assets/services/blanchisserie.webp';
import retouche from '../assets/services/retouche.jpg';
import livraison from '../assets/services/livraison.png'
import repassage from '../assets/services/repassage.png'
import Service_entreprise from '../assets/services/SERVICE_entreprise.jpg'
import { Sparkles, Shirt, Scissors, Check } from 'lucide-react';

export default function Services() {
  const services_premium = [
    {
      id: 1,
      nom: 'nettoyage à sec',
      description:
        'Nettoyage professionnel pour costumes robes de soirée et textiles délicats avec des produits premium.',
      image: nettoyage,
      objectif: [
        'Costumes & Tailleurs',
        'Robes de soirée',
        'Textiles délicats',
      ],
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
      nom: 'retouche & couture ',
      description:
        'Ajustements, réparations et modifications par des mains expertes. Redonnez vie à vos vêtements.',
      image: retouche,
      objectif: [
        'Ajustements sur mesure',
        'Réparations',
        'Modifications créatives',
      ],
      icone: Scissors,
    },
    {
      id: 4,
      nom: 'repassage  ',
      description:
        'Ajustements, réparations et modifications par des mains expertes. Redonnez vie à vos vêtements.',
      image: repassage,
      objectif: [
        'Ajustements sur mesure',
        'Réparations',
        'Modifications créatives',
      ],
      icone: Scissors,
    },
    {
      id: 5,
      nom: 'livraison',
      description:
        'Nous récupérons vos vêtements à domicile et vous les retournons propres, et emballés dans les meilleurs délais',
      image: livraison,
      objectif: [
        'Ajustements sur mesure',
        'Réparations',
        'Modifications créatives',
      ],
      icone: Scissors,
    },
    {
        id: 6,
        nom: 'Service entreprise',
        description:
          "Entretien d'uniforme , nappe,serviette et linge professionnel ",
        image: Service_entreprise,
        objectif: [
          'Hôtels',
          'Restaurant',
          'Salle de sport',
        ],
        icone: Scissors,
      }
  ];

  return (
    <section className="pb-10 min-h-screen  ">
      <div className="container text-[#111111] mx-auto ">
        <div className="text-center mb-16">
          <p className="py-2 text-blue-500 font-bold text-sm tracking-[0.3em] uppercase">
            CE QUE NOUS OFFRONS
          </p>
          <h1 className="text-[#111111] text-4xl md:text-5xl font-black uppercase tracking-tighter">
            NOS DIFFERENTS SEVICES{' '}
          </h1>

          <div className="w-24 h-1 bg-yellow-500 mx-auto my-6 rounded-full"></div>
          <p className="text-gray-400 italic max-w-2xl mx-auto">
            Des services professionnels pour prendre soin de vos vêtements avec
            expertise et délicatesse
          </p>
        </div>

        <div className="mx-auto  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {services_premium.map((service) => (
            <div
              key={service.id}
              className={`  rounded-t-2xl bg-gray-100 uppercase w-auto  h-auto  m-4 max-[767px]:w-full border-gray-300`}
            >
              <section className="relative  h-52 w-full overflow-hidden " id="entete">
                <img
                  src={service.image}
                  alt=""
                  className="rounded-t-2xl w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="font-bold absolute bottom-2  flex flex-row ml-2 p-2">
                  {<service.icone />}
                  <span className="px-1 text-blue-500">{service.nom}</span>
                </div>
              </section>

              <section
                className="bg-white p-5 text-left text-sm text-gray-700 h-50 rounded-2xl"
                id="body"
              >
                <p className=" w-full text-left mx-2 mb-3">
                  {service.description}
                </p>
                {service.objectif.map((obj, index) => (
                  <div className="flex flex-row py-0.5  " id={index}>
                    <Check className="w-4 text-blue-500 ml-2" />
                    <p className="text-gray-500 mx-2">{obj}</p>
                  </div>
                ))}
              </section>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
