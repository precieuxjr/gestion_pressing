import nettoyage from '../assets/galerie/nettoyage a sec.webp'
import blachisserie from '../assets/galerie/blanchisserie.webp'
import retouche from '../assets/galerie/retouche.jpg'
import { Sparkles, Shirt, Scissors,Check} from 'lucide-react';

export default function Galerie(){
const services_premium = [
    {
id : 1,
nom :'nettoyage à sec',
description : 'Nettoyage professionnel pour costumes robes de soirée et textiles délicats avec des produits premium.',
image: nettoyage,
objectif :['Costumes & Tailleurs','Robes de soirée','Textiles délicats'],
 icone: Sparkles
},

{
id:2,
nom: 'blanchisserie',
description :'Du linge impeccable, parfaitement lavé, repassé et plié. Service pour particuliers et professionnels.',
image:blachisserie,
objectif :  ['Chemises & Pantalons','Linge de maison','Service B2B'],
icone: Shirt
},

{
id:3,
nom:'retouche & couture ',
description: 'Ajustements, réparations et modifications par des mains expertes. Redonnez vie à vos vêtements.',
image: retouche,
objectif : ['Ajustements sur mesure','Réparations', 'Modifications créatives'],
icone: Scissors
}

];




    return(


        <section className="pb-10 min-h-screen  ">         
       
               <div className="container text-[#111111] mx-auto ">
                <div className="text-center mb-16">
                <p className="py-2 text-blue-500 font-bold text-sm tracking-[0.3em] uppercase">CE QUE NOUS OFFRONS</p>
                <h1 className="text-[#111111] text-4xl md:text-5xl font-black uppercase tracking-tighter">NOS SEVICE PREMIUM</h1>

                <div className="w-24 h-1 bg-yellow-500 mx-auto my-6 rounded-full"></div>
                <p className="text-gray-400 italic max-w-2xl mx-auto">Des services professionnels pour prendre soin de vos vêtements avec expertise et délicatesse</p>
                </div>




<div className="flex flex-rows justify-center items-center  max-[767px]:flex-col ">
{services_premium.map((service) =>( 
    <div key={service.id} className={` pb-6 px-  rounded-t-2xl bg-gray-100 uppercase w-80  h-7  m-4 max-[767px]:w-full border-gray-300`}>
        <section className='relative ' id='entete'>
    <img src={service.image} alt="" className="rounded-t-2xl w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
     <div className='font-bold absolute bottom-2  flex flex-row ml-2 p-2'>
        {<service.icone />}
     <span className="px-1 text-blue-500">{ service.nom}</span>
     </div>
     </section>

     <section className='bg-white p-5 text-left text-sm text-gray-700  rounded-2xl' id='body'>
    <p className=' w-full text-left mx-2 mb-3'>{service.description}</p>
    {service.objectif.map((obj,index) =>( <div className='flex flex-row py-0.5  ' id={index}>
        <Check className='w-4 text-blue-500 ml-2'/>
        <p className='text-gray-500 mx-2' >{obj}</p>

         </div>)
    )
    }

  

     </section>



    </div>

)

)} 
</div>


                </div> 
             
        
</section>

    )
}

