import React, { useState } from 'react';

export default function Contact() {
  // 1. Un seul état pour tout le formulaire
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    numero:"",
    service: "blanchisserie", // Valeur par défaut
    message: ""
  });

  // 2. La fonction magique pour tout gérer
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,       // On garde les anciennes données
      [name]: value      // On met à jour uniquement le champ qui a changé
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    console.log("Données envoyées :", formData);
    alert(`Merci ${formData.nom}, votre demande pour le service ${formData.service} a été reçue !`);
  };

  return (
    <section>
        <div className='flex flex-col items-center'>
<h3 className='py-2 text-blue-500 font-bold text-sm tracking-[0.3em]'>CONTACT</h3>
<h1 className='text-[#111111]  text-4xl md:text-5xl font-black uppercase tracking-tighter'>CONTACTEZ-NOUS</h1>
<div className="w-24 h-1 bg-yellow-500 mx-auto my-4"></div> 
<p className='text-gray-400'>Une question ? Un devis ? N'hésitez pas à nous contacter</p>
</div>

        <div className=' grid-cols-2 flex flex-row py-4 px-20 gap-10'>


    <form onSubmit={handleSubmit} className=" bg-transparent  rounded-2xl flex flex-col gap-4 w-150   ">
        <div className='flex flex-row gap-10'>
 <div className='flex flex-col m'>
     <label htmlFor="nom">Nom complet</label>
      {/* Input Nom */}
      <input    
        name="nom" // IMPORTANT : doit correspondre à la clé dans le useState
        value={formData.nom}
        onChange={handleChange}
        placeholder="Votre nom"
        className="p-3 w-70 rounded bg-gray-600 text-white outline-none focus:ring-2 focus:ring-blue-500"
      />  </div>

<div className='flex flex-col'>
       <label htmlFor="numero">Téléphone</label>
<input
        name="numero" // IMPORTANT : doit correspondre à la clé dans le useState
        value={formData.numero}
        onChange={handleChange}
        placeholder="Votre nom"
        className="p-3  w-70 rounded bg-gray-600 text-white outline-none focus:ring-2 focus:ring-blue-500"
      /></div>
      </div>

    <div className="flex flex-col">

    <label htmlFor="email">Email</label>
<input
        name="email" // IMPORTANT : doit correspondre à la clé dans le useState
        value={formData.email}
        onChange={handleChange}
        placeholder="Votre nom"
        className="p-3 rounded bg-gray-600 text-white outline-none focus:ring-2 focus:ring-blue-500"
      />
      </div>
      <div className="flex flex-col">
<label htmlFor="service">Service souhaité</label>
      {/* Select Service */}
      <select 
        name="service"  
        value={formData.service}
        onChange={handleChange}
        className="p-3 rounded bg-gray-600 text-white"
      >
        <option value="nettoyage">Nettoyage à sec</option>
        <option value="blanchisserie">Blanchisserie</option>
        <option value="retouche">Retouche</option>
      </select>
      </div>
<div className='flex flex-col'>
      {/* Textarea Message */}
      <label htmlFor="message">Message</label>
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Détails de votre commande..."
        className="p-3 rounded bg-gray-600 text-white h-32"
      />
      </div>
      

      <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
        Envoyer la demande
      </button>
    </form>
   

    <div className='bg-transparent '>
         <h2>Information de contact</h2>
    
    
    </div>
    </div>
    </section>
  );
}