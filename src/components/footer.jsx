
import { ArrowRight } from 'lucide-react';


export default function Footer() {
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
  <ArrowRight className="w-4 h-4 text-blue-500 mt-1 shrink-0 transition-transform group-hover:translate-x-1" />;
  return (
    <div className="bg-gray-300/30 py-4">
      <section className=" flex flex-col">
        <div className="grid grid-cols-4 gap-7 px-20 ">
          <p className="text-sm">
            SMART PRESSING , votre partenaire de confiance pour le nettoyage à
            sec, la blanchisserie et les retouches à Kinshasa. Meilleur Ouvrier
            du Congo. <div className="border-b border-gray-300  "></div>
          </p>

          <div className="flex flex-col gap-3">
            <div>
              <p className="font-bold">Liens Rapides</p>
              <div className="bg-blue-500 h-1 w-8"></div>
            </div>

            <ul className=" flex flex-col gap-2">
              {foot_item.map((item) => (
                <li key={item.nom} className="text-gray-600">
                  <a
                    href={`#${item.ancre}`}
                    className="text-brand-primary hover:text-brand-text transition-colors flex "
                  >
                    {item.nom}
                    <ArrowRight className="w-4 h-4 text-blue-500 mt-1 shrink-0 transition-transform group-hover:translate-x-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className=" flex flex-col gap-3">
            <div>
              <p className="font-bold">Nos Service</p>
              <div className="bg-blue-500 h-1 w-8"></div>
            </div>

            <ul className="gap-2 flex flex-col">
              {Nos_services.map((item) => (
                <li key={item.nom} className="text-gray-600">
                  <a
                    href={`#${item.ancre}`}
                    className="text-brand-primary hover:text-brand-text transition-colors flex "
                  >
                    {item.nom}
                    <ArrowRight className="w-4 h-4 text-blue-500 mt-1 shrink-0 transition-transform group-hover:translate-x-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
      
          <div className=" flex flex-col ">
            <h2 className="font-bold">CONNECTEZ-VOUS</h2>
            <div className="bg-blue-500 h-1 w-8"></div>
            <div className='flex flex-col  my-2'>
            
              <label htmlFor=""className='text-gray-600'>Email </label>
              <input
                type="email"
                name="email"
                placeholder="exemple@gmail.com"
                className="w-40 bg-gray-50  h-auto border rounded-lg border-gray-300 focus: border-outline-none "
              /> 
              </div> 


<label htmlFor="" className='text-gray-600'>Mot de passe </label>
              <input
                type="password"
                name="email"
                placeholder=" ****"
                className="w-40 bg-gray-50  h-auto border rounded-lg border-gray-300"
              />
              <input type="submit" className='p-1 gap-2 m-1 bg-blue-700 text-white font-semibold w-40 border border-gray-100 rounded-2xl' value='Connexion'  />
              <p className='text-[11px]'>Vous n'avez pas de compte?<spans><a href="">s'inscrire</a></spans></p>
           
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center justify-center pt-4 pb-2">
          <div>
            <p className="text-[11px]">
              Smart pressing by JS and KAZMAN. Tous droits réservés.
            </p>
          </div>
          <div>
            <p className="text-[11px]">
              Conditions d'utilisation | Politique de confidentialité
            </p>
          </div>
          <div className="text-[11px]">
            Meilleur Ouvrier du Congo - Kinshasa, RDC
          </div> 
        </div>
      </section>
    </div>
    
  );
 
}
