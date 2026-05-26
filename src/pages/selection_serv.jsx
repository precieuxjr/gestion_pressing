import React, { useState } from 'react';
import Navbar from '../components/navbar';


export default function ServicesPage() {
  // État pour gérer les quantités de chaque service (0 par défaut)
  const [quantities, setQuantities] = useState({
    lavageRepassage: 2, // Initialisé à 2kg comme sur la photo
    nettoyageSec: 1,    // Initialisé à 1 pièce comme sur la photo
    blanchisserie: 2,   // Initialisé à 2kg comme sur la photo
    chaussures: 0,
    sacs: 0,
    siegesAuto: 0,
    rideauxTapis: 0,
    vetementsBebe: 0,
  });

  // État pour la coche de l'abonnement
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Configuration des données des services (Prix et Unités)
  const serviceDetails = {
    lavageRepassage: { name: "Lavage & Repassage", price: 2500, unit: "kg" },
    nettoyageSec: { name: "Nettoyage à sec", price: 4000, unit: "pièce" },
    blanchisserie: { name: "Blanchisserie", price: 2000, unit: "kg" },
    chaussures: { name: "Nettoyage Chaussures", price: 3000, unit: "paire" },
    sacs: { name: "Nettoyage Sacs", price: 5000, unit: "pièce" },
    siegesAuto: { name: "Nettoyage Sièges Auto", price: 10000, unit: "siège" },
    rideauxTapis: { name: "Rideaux & Tapis", price: 3500, unit: "m²" },
    vetementsBebe: { name: "Vêtements Bébé", price: 2000, unit: "pièce" },
  };

  // Fonctions pour modifier les quantités
  const increment = (id) => {
    setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decrement = (id) => {
    setQuantities(prev => ({ ...prev, [id]: prev[id] > 0 ? prev[id] - 1 : 0 }));
  };

  const removeService = (id) => {
    setQuantities(prev => ({ ...prev, [id]: 0 }));
  };

  // Calculs financiers dynamiques
  const subtotal = Object.keys(quantities).reduce((acc, id) => {
    return acc + (quantities[id] * serviceDetails[id].price);
  }, 0);

  const deliveryFee = subtotal > 0 ? 1000 : 0;
  const total = subtotal + deliveryFee;
  
  // Seuil pour la livraison gratuite (20 000 FCFA)
  const freeDeliveryThreshold = 20000;
  const missingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercentage = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  // Compteur d'articles distincts sélectionnés
  const selectedItemsCount = Object.values(quantities).filter(q => q > 0).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-[#1E293B]">
      
      {/* 1. HEADER / NAVBAR (Fidèle à l'image) */}
      <Navbar />

      {/* CONTENEUR PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* 2. INTRODUCTION SECTION */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 bg-blue-50 text-[#2563EB] rounded-full flex items-center justify-center shadow-inner relative">
            {/* Icône Cintre & Bulles */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096M9 21h7.5M12 3c-1.38 0-2.5 1.12-2.5 2.5V6h5V5.5C14.5 4.12 13.38 3 12 3zm0 3h.008v.008H12V6zm-5.25 3.75h10.5a.75.75 0 01.75.75v6.75a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 16.5V10.5a.75.75 0 01.75-.75z" />
            </svg>
            <span className="absolute top-2 right-2 w-3 h-3 bg-blue-400 rounded-full animate-ping"></span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Choisissez vos services</h1>
            <p className="text-slate-500 mt-1 font-medium">Sélectionnez les services qui répondent à vos besoins. Nous nous occupons du reste !</p>
          </div>
        </div>

        {/* 3. GRILLE DES SERVICES + PANNEAU DE SÉLECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* COLONNE GAUCHE & MILIEU : LES SERVICES DISPONIBLES */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0F172A]">Nos services disponibles</h2>
              <button className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-semibold text-[#2563EB] shadow-sm transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
                Voir les packs
              </button>
            </div>

            {/* Grille responsive 2 colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Object.keys(serviceDetails).map((id) => {
                const service = serviceDetails[id];
                const qte = quantities[id];
                const isSelected = qte > 0;

                return (
                  <div
                    key={id}
                    className={`bg-white rounded-2xl p-5 border-2 transition-all duration-300 relative flex flex-col justify-between h-56 shadow-sm ${
                      isSelected ? 'border-[#2563EB] ring-4 ring-blue-500/5' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {/* Checkbox en haut à droite */}
                    <div className="absolute top-5 right-5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        isSelected ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-slate-200 bg-slate-50'
                      }`}>
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Contenu : Icône / Nom / Prix */}
                    <div className="flex gap-4">
                      {/* Avatar SVG générique coloré simulant les différentes icônes de la photo */}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold shadow-inner ${
                        id === 'lavageRepassage' ? 'bg-blue-50 text-blue-500' :
                        id === 'nettoyageSec' ? 'bg-purple-50 text-purple-500' :
                        id === 'blanchisserie' ? 'bg-teal-50 text-teal-500' : 'bg-orange-50 text-orange-500'
                      }`}>
                        {/* Remplacement des icônes par des visuels propres */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0F172A] text-base">{service.name}</h3>
                        <p className="text-[#2563EB] font-bold text-sm mt-0.5">
                          {service.price.toLocaleString()} FCFA <span className="text-slate-400 font-medium text-xs">/ {service.unit}</span>
                        </p>
                        <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-[180px]">
                          Lavage professionnel et traitement soigné.
                        </p>
                      </div>
                    </div>

                    {/* Sélecteur de quantité numérique bas de carte */}
                    <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-2">
                      <button 
                        onClick={() => decrement(id)}
                        className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold transition-colors cursor-pointer"
                      >
                        –
                      </button>
                      <span className="text-sm font-bold text-[#0F172A]">
                        {qte} <span className="text-slate-400 font-medium text-xs">{service.unit}</span>
                      </span>
                      <button 
                        onClick={() => increment(id)}
                        className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Bouton additionnel Besoins Speciaux */}
            <div className="mt-6 flex justify-center">
              <button className="flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 border border-dashed border-blue-200 rounded-xl px-6 py-3 w-full justify-center transition-all cursor-pointer">
                <span>+</span> Besoin d'un service spécial ? <span className="text-slate-400 font-normal text-xs ml-1">Demandez un service sur mesure</span>
              </button>
            </div>
          </div>

          {/* COLONNE DROITE : PANNEAU "VOTRE SÉLECTION" */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#0F172A]">Votre sélection</h2>
                <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
                  {selectedItemsCount}
                </span>
              </div>

              {/* Liste des articles sélectionnés à droite */}
              <div className="space-y-4 mb-6">
                {Object.keys(quantities).map((id) => {
                  const qte = quantities[id];
                  const service = serviceDetails[id];
                  if (qte === 0) return null;

                  return (
                    <div key={id} className="flex items-center justify-between py-2 border-b border-slate-50">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#2563EB]">
                          {/* Mini Icône */}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#0F172A]">{service.name}</h4>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{qte} {service.unit}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-[#2563EB]">
                          {(qte * service.price).toLocaleString()} FCFA
                        </span>
                        <button 
                          onClick={() => removeService(id)}
                          className="text-slate-300 hover:text-red-500 transition-colors text-sm font-bold px-1"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}

                {selectedItemsCount === 0 && (
                  <p className="text-sm text-slate-400 text-center py-6 font-medium">Aucun service sélectionné pour le moment.</p>
                )}
              </div>

              {/* Totalisations intermédiaires */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-sm font-medium text-slate-500">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-bold text-[#0F172A]">{subtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span className="font-bold text-[#0F172A]">{deliveryFee.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#0F172A] pt-3 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-[#2563EB] text-lg">{total.toLocaleString()} FCFA</span>
                </div>
              </div>

              {/* Composant de livraison offerte dynamique */}
              <div className="mt-6 bg-blue-50/60 rounded-2xl p-4 border border-blue-100">
                <div className="flex gap-3">
                  <div className="text-[#2563EB] mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM19.5 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM2.25 5.25h16.5M19.5 5.25h2.25A1.5 1.5 0 0123 6.75V15a1.5 1.5 0 01-1.5 1.5H3.75A1.5 1.5 0 012.25 15V5.25zm0 0h1.5" />
                    </svg>
                  </div>
                  <div className="w-full">
                    <h5 className="font-bold text-xs text-[#0F172A]">Livraison offerte dès 20 000 FCFA</h5>
                    {missingForFreeDelivery > 0 ? (
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">Il vous manque {missingForFreeDelivery.toLocaleString()} FCFA pour en profiter.</p>
                    ) : (
                      <p className="text-[11px] text-green-600 font-bold mt-0.5">Félicitations ! Votre livraison est offerte !</p>
                    )}
                    {/* Barre de progression */}
                    <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                      <div 
                        className="bg-[#2563EB] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloc Switch Abonnement */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <h5 className="font-bold text-sm text-[#0F172A]">Souhaitez-vous un abonnement ?</h5>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Bénéficiez de remises et d'avantages exclusifs.</p>
                
                <div className="mt-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#0F172A] block">Oui, je m'abonne</span>
                    <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded mt-1 inline-block">-10% sur chaque commande</span>
                  </div>
                  {/* Bouton Toggle / Switch HTML personnalisé */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isSubscribed}
                      onChange={() => setIsSubscribed(!isSubscribed)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563EB]"></div>
                  </label>
                </div>
              </div>

            </div>

            {/* Bouton étape suivante d'action principale */}
            <div className="mt-8 space-y-4">
              <button className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 cursor-pointer">
                <span>Étape suivante</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Paiement 100% sécurisé
              </div>
            </div>

          </div>

        </div>

        {/* 4. FOOTER BAR : LES ENGAGEMENTS ET ATOUTS (Bas de la photo) */}
        <footer className="mt-16 bg-white border border-slate-100 rounded-3xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#2563EB]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM19.5 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM2.25 5.25h16.5" /></svg>
            </div>
            <span className="font-bold text-xs text-[#0F172A]">Livraison rapide</span>
            <span className="text-[10px] text-slate-400 font-medium -mt-1">À domicile ou au bureau</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#2563EB]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className="font-bold text-xs text-[#0F172A]">Qualité garantie</span>
            <span className="text-[10px] text-slate-400 font-medium -mt-1">Service professionnel</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#2563EB]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.214.133a1.583 1.583 0 001.514 0l.214-.133V13.6h-1.943zm-.458-5.323a1.583 1.583 0 011.514 0l.214.133v1.942H11.32z" /></svg>
            </div>
            <span className="font-bold text-xs text-[#0F172A]">Prix transparents</span>
            <span className="text-[10px] text-slate-400 font-medium -mt-1">Aucun frais caché</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#2563EB]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
            </div>
            <span className="font-bold text-xs text-[#0F172A]">Support 24/7</span>
            <span className="text-[10px] text-slate-400 font-medium -mt-1">Nous sommes là pour vous</span>
          </div>
        </footer>

      </main>
    </div>
  );
}