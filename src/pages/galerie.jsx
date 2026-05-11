
import chemise_avant from '../assets/galerie/3 avant.png'
import chemise_apres from '../assets/galerie/3 apres.png'
import robe_avant from '../assets/galerie/robe avant.png'
import robe_apres from '../assets/galerie/robe apres.png'
import veste_avant  from '../assets/galerie/veste avant.png'
import veste_apres from '../assets/galerie/veste apres.png'


const realisation =  [{id : 1 , im_avant :veste_avant, im_apres :veste_apres ,categorie: 'Nettoyage à sec',nom_re : 'Costume homme' ,description:'Détachage et pressing complet'},
                      {id : 2 , im_avant :robe_avant, im_apres :robe_apres ,categorie: 'Blanchisserie',nom_re : 'Robe de soirée' ,description:'Nettoyage délicat et repassage'},
                      { id : 3 , im_avant :chemise_avant, im_apres :chemise_apres ,categorie: 'Repassage',nom_re : 'Chemises blanches' ,description:'Blanchisserie et repassage pro'}
];



export default function Galerie (){







    
    return(

<section>

<div className=" flex flex-col items-center"> 
    <h2 className="py-2 text-blue-500 font-bold text-sm tracking-[0.3em]">NOS REALISATION</h2>
    <h1 className="text-[#111111]  text-4xl md:text-5xl font-black uppercase tracking-tighter">GALERIE <span className="text-amber-500">AVANT</span>/<span className="text-blue-600">APRES</span></h1>

    <div className="w-24 h-1 bg-yellow-500 mx-auto my-4"></div>
    <p className='text-gray-400 italic max-w-2xl mx-auto my-2'>Survoler les images pour voir la transformation</p>
</div>

<div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-6xl mx-auto">
        {realisation.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-2xl  bg-gray-100 shadow-xl">
            
            {/* Conteneur d'images */}
            <div className="relative h-80 w-full overflow-hidden">
              {/* Image AVANT (Visible par défaut) */}
              <img 
                src={item.im_avant} 
                alt="Avant" 
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0" 
              />
              
              {/* Image APRÈS (Visible au survol) */}
              <img 
                src={item.im_apres} 
                alt="Après" 
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
              />

              {/* Badge Dynamique (Optionnel) */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase group-hover:hidden">Avant</span>
                <span className="hidden bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase group-hover:block">Après</span>
              </div>
            </div>

            {/* Texte descriptif */}
            <div className="p-6">
               <span className=" text-xs font-bold border border-gray-300  border-b-amber-300 border-r-amber-300  rounded-2xl px-2 py-1 ">{item.categorie.toUpperCase()}</span>
               <h3 className="text-blue-500 text-2xl font-bold mt-3">{item.nom_re}</h3>
               <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div></div>

</section>

    )
}