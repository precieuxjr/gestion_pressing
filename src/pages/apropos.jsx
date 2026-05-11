import { Star,Check,Clock,Smile } from 'lucide-react';
import im_personnel from '../assets/services/nettoyage a sec.webp';

export default function Apropos() {
  const avantages = [
    {
      id: 1,
      icone: <Star size={30} strokeWidth={1.5} />,
      couleur:'text-yellow-400',
      nom: 'Meilleur Ouvrier',
      description: 'Expertise officiellement reconnue au Congo',
    },
    {
      id: 2,
      icone: <Check size={30} strokeWidth={1.5} />,
      couleur:'text-blue-400',
      nom: 'Qualité Premium',
      description: 'Produits et équipements haut de gamme',
    },
    {
      id: 3,
      icone: <Clock size={30} strokeWidth={1.5} />,
      couleur:'text-blue-400',
      nom: 'Service Rapide',
      description: 'Délais toujours respectés',
    },
    {
      id: 4,
      icone: <Smile size={30} strokeWidth={1.5} />,
      couleur:'text-yellow-400',
      nom: 'Satisfaction Garantie',
      description: 'Votre bonheur, notre priorité',
    },
  ];

  return (
    <section className="flex flex-row  mx-auto ">
      <div className=" flex flex-col m-1 px-15 ">
        <p className="py-2 mx-1 text-justify text-blue-500 font-bold text-sm tracking-[0.3em] ">
          NOTRE HISTOIRE
        </p>

        <h1 className="text-[#111111]  text-4xl md:text-4xl font-black uppercase tracking-tighter ">
          QUI SOMME NOUS ?
        </h1>
        <div className="w-10 h-1 bg-amber-300 my-1 mx-1"></div>

        <p className="py-4 text-gray-600 text-justify">
          Notre engagement envers l'excellence et notre passion pour le métier
          font de smart Pressing le choix privilégié des Kinois
          exigeants.
        </p>

        <div className="grid grid-cols-2 ">
          {avantages.map((item) => (
            <div
              key={item.id}
              className="  rounded-xl mx-3 my-3 ml-0 flex flex-row items-center bg-gray-100 shadow-xl "
            >
              <div className="w-15 h-10 justify-center flex   ">
                <span className={item.couleur}>{item.icone}</span>
              </div>

              <div className="">
                <p className='text-blue-400 text-lg font-ligth'>{item.nom}</p>
                <p className="text-sm text-gray-500 ">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-end m-1 px-15">
        <img
          src={im_personnel}
          alt=""
          className="rounded-2xl inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
      </div>
    </section>
  );
}
