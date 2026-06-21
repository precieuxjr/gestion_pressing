import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/navbar';
import StepButton from '../components/verif';
import { 
  Sparkles, Shirt, Scissors, Waves, Truck, 
  Briefcase, Check, ShieldCheck, Plus, Package
} from 'lucide-react';

export default function ServicesPage() {
  // Tableau de tes nouveaux services sans les propriétés d'images inutilisées
  const servicesList = [
    {
      id: 'nettoyageSec',
      nom: 'Nettoyage à sec',
      description: 'Nettoyage professionnel pour costumes, robes de soirée et textiles délicats avec des produits premium.',
      objectif: ['Costumes & Tailleurs', 'Robes de soirée', 'Textiles délicats'],
      icone: Sparkles,
      price: 4000,
      unit: "pièce",
      color: "bg-purple-50 text-purple-500 dark:bg-purple-950/40 dark:text-purple-400"
    },
    {
      id: 'blanchisserie',
      nom: 'Blanchisserie',
      description: 'Du linge impeccable, parfaitement lavé, repassé et plié. Service pour particuliers et professionnels.',
      objectif: ['Chemises & Pantalons', 'Linge de maison', 'Service B2B'],
      icone: Shirt,
      price: 2500,
      unit: "kg",
      color: "bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-400"
    },
    {
      id: 'retoucheCouture',
      nom: 'Retouche & Couture',
      description: 'Ajustements, réparations et modifications par des mains expertes. Redonnez vie à vos vêtements.',
      objectif: ['Ajustements sur mesure', 'Réparations', 'Modifications créatives'],
      icone: Scissors,
      price: 3000,
      unit: "pièce",
      color: "bg-orange-50 text-orange-500 dark:bg-orange-950/40 dark:text-orange-400"
    },
    {
      id: 'repassage',
      nom: 'Repassage',
      description: 'Repassage professionnel sur table aspirante et soufflante pour un fini impeccable, sans faux plis.',
      objectif: ['Chemises & Pantalons', 'Draps & Nappes', 'Service rapide'],
      icone: Waves,
      price: 2000,
      unit: "pièce",
      color: "bg-teal-50 text-teal-500 dark:bg-teal-950/40 dark:text-teal-400"
    },
    {
      id: 'livraisonExpress',
      nom: 'Livraison Express',
      description: 'Nous récupérons vos vêtements à domicile et vous les retournons propres et emballés dans les meilleurs délais.',
      objectif: ['Récupération à domicile', 'Livraison express à Kinshasa'],
      icone: Truck,
      price: 3500,
      unit: "course",
      color: "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400"
    },
    {
      id: 'serviceEntreprise',
      nom: 'Service Entreprise',
      description: "Prise en charge globale et entretien d'uniformes, nappes, serviettes et linge professionnel.",
      objectif: ['Hôtels & Hébergements', 'Restaurants & Cafés', 'Salles de sport & Spas'],
      icone: Briefcase,
      price: 15000,
      unit: "contrat",
      color: "bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400"
    },
  ];

  // État des quantités calqué sur les identifiants
  const [quantities, setQuantities] = useState(
    servicesList.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {})
  );

  const [isSubscribed, setIsSubscribed] = useState(false);

  const increment = (id) => setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));
  const decrement = (id) => setQuantities(prev => ({ ...prev, [id]: prev[id] > 0 ? prev[id] - 1 : 0 }));
  const removeService = (id) => setQuantities(prev => ({ ...prev, [id]: 0 }));

  const subtotalBase = servicesList.reduce((acc, s) => acc + (quantities[s.id] * s.price), 0);
  const discount = isSubscribed ? subtotalBase * 0.1 : 0;
  const subtotal = subtotalBase - discount;
  const deliveryFee = subtotal > 0 && subtotal < 20000 ? 2000 : 0;
  const total = subtotal + deliveryFee;
  
  const freeDeliveryThreshold = 20000;
  const missingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercentage = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const selectedItemsCount = Object.values(quantities).filter(q => q > 0).length;
  const navigate = useNavigate();
    // ✅ Définition de handleClick
    const handleClick = () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Connecté → action suivante
        navigate('/etape-suivante');
      } else {
        // Non connecté → redirection vers login
        navigate('/login?create=true');
      }
    };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* EN-TÊTE PAGE */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-inner relative shrink-0">
            <Shirt className="w-8 h-8" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping"></span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Configurez votre commande</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Sélectionnez vos services de pressing et blanchisserie à Kinshasa.</p>
          </div>
        </div>

        {/* CONTENU EN GRILLE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* ZONE DE SÉLECTION DES CARTES */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Prestations à la carte</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {servicesList.map((service) => {
                const qte = quantities[service.id];
                const isSelected = qte > 0;
                const Icone = service.icone;

                return (
                  <div
                    key={service.id}
                    className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all duration-300 relative flex flex-col justify-between h-60 shadow-sm ${
                      isSelected 
                        ? 'border-blue-600 dark:border-blue-500 ring-4 ring-blue-500/5 dark:ring-blue-400/5' 
                        : 'border-slate-100 dark:border-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Indicateur de coche haute-fidélité */}
                    <div className="absolute top-5 right-5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Détails textuels du service */}
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${service.color}`}>
                        <Icone className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{service.nom}</h3>
                        <p className="text-blue-600 dark:text-blue-400 font-extrabold text-sm mt-1">
                          {service.price.toLocaleString()} <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">FCFA / {service.unit}</span>
                        </p>
                        <p className="text-slate-400 dark:text-slate-400 text-xs mt-2 font-normal leading-relaxed line-clamp-2">
                          {service.description}
                        </p>
                        {/* Badges d'objectifs / cibles */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {service.objectif.map((obj, i) => (
                            <span key={i} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 targets-badge">
                              {obj}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Contrôle de quantité */}
                    <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50 pt-3">
                      <button 
                        onClick={() => decrement(service.id)}
                        disabled={qte === 0}
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold transition-colors cursor-pointer select-none ${
                          qte > 0 
                            ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700' 
                            : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/50 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                        }`}
                      >
                        –
                      </button>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {qte} <span className="text-slate-400 dark:text-slate-500 font-medium text-xs">{service.unit}</span>
                      </span>
                      <button 
                        onClick={() => increment(service.id)}
                        className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center font-bold transition-colors cursor-pointer select-none"
                      >
                        +
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <button className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-dashed border-blue-200 dark:border-blue-800/60 rounded-xl px-6 py-4 w-full justify-center transition-all cursor-pointer">
                <Plus className="w-4 h-4" /> Besoin d'un service spécial ou sur-mesure ?
              </button>
            </div>
          </div>

          {/* COLONNE RÉCAPITULATIF PANIER */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/60 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Votre Panier</h2>
                <span className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                  {selectedItemsCount}
                </span>
              </div>

              {/* Lignes d'articles sélectionnés */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-1">
                {servicesList.map((service) => {
                  const qte = quantities[service.id];
                  if (qte === 0) return null;
                  const MiniIcone = service.icone;

                  return (
                    <div key={service.id} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800/40">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                          <MiniIcone className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{service.nom}</h4>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{qte} {service.unit}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">
                          {(qte * service.price).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">FCFA</span>
                        </span>
                        <button 
                          onClick={() => removeService(service.id)}
                          className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors text-lg font-bold px-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}

                {selectedItemsCount === 0 && (
                  <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8 font-medium">Votre panier est vide.</p>
                )}
              </div>

              {/* Lignes de calcul financiers */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-sm font-medium text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Sous-total brut</span>
                  <span className="font-bold text-slate-900 dark:text-white">{subtotalBase.toLocaleString()} FCFA</span>
                </div>
                {isSubscribed && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Remise Fidélité (-10%)</span>
                    <span className="font-bold">- {discount.toLocaleString()} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {deliveryFee > 0 ? `${deliveryFee.toLocaleString()} FCFA` : 'Gratuite'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <span>Total final</span>
                  <span className="text-blue-600 dark:text-blue-400 text-lg font-black">{total.toLocaleString()} FCFA</span>
                </div>
              </div>

              {/* Jauge Dynamique Livraison Gratuite */}
              <div className="mt-6 bg-blue-50/60 dark:bg-blue-950/20 rounded-2xl p-4 border border-blue-100/60 dark:border-blue-900/30">
                <div className="flex gap-3">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div className="w-full">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Livraison gratuite dès 20 000 FCFA</h5>
                    {missingForFreeDelivery > 0 ? (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Plus que {missingForFreeDelivery.toLocaleString()} FCFA pour économiser la livraison.</p>
                    ) : (
                      <p className="text-[11px] text-green-600 dark:text-green-400 font-bold mt-0.5">Félicitations ! Frais offerts sur Kinshasa.</p>
                    )}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module de souscription récurrent d'abonnement */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">Activer un abonnement</h5>
                <div className="mt-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/40 rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">Je m'abonne au pressing</span>
                    <span className="text-[10px] text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-950/30 px-1.5 py-0.5 rounded mt-1 inline-block">-10% immédiat</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isSubscribed}
                      onChange={() => setIsSubscribed(!isSubscribed)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              </div>

            </div>

            {/* CTA Final */}
            <div className="mt-8 space-y-4">
            <StepButton
  onClick={handleClick}
  label="Passer à l'étape suivante"
  className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/10 transform hover:-translate-y-0.5 cursor-pointer"
/>
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Traitement et suivi sécurisés
              </div>
            </div>

          </div>

        </div>

        {/* REASSURANCES BAS DE PAGE */}
        <footer className="mt-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-sm">
          {[
            { title: "Livraison Rapide", desc: "À domicile à Kinshasa", icon: Truck },
            { title: "Qualité Garantie", desc: "Soin textile expert", icon: ShieldCheck },
            { title: "Prix Transparents", desc: "Zéro frais cachés", icon: Package },
            { title: "Support Client", desc: "À votre écoute", icon: Shirt }
          ].map((item, index) => {
            const FootIcon = item.icon;
            return (
              <div key={index} className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FootIcon className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium -mt-0.5">{item.desc}</span>
              </div>
            );
          })}
        </footer>

      </main>
    </div>
  );
}