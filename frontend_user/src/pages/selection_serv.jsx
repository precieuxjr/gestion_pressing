import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import StepButton from '../components/verif';
import { 
  Sparkles, Shirt, Scissors, Waves, Truck, 
  Briefcase, Check, ShieldCheck, Plus, Package
} from 'lucide-react';

export default function ServicesPage() {
  const navigate = useNavigate();

  // 1️⃣ Définition des services
  const servicesList = [
    {
      id: '1',
      nom: 'Nettoyage à sec',
      description: 'Nettoyage professionnel pour costumes, robes de soirée et textiles délicats avec des produits premium.',
      objectif: ['Costumes & Tailleurs', 'Robes de soirée', 'Textiles délicats'],
      icone: Sparkles,
      price: 4000,
      unit: "pièce",
      color: "bg-purple-50 text-purple-500 dark:bg-purple-950/40 dark:text-purple-400"
    },
    {
      id: '2',
      nom: 'Blanchisserie',
      description: 'Du linge impeccable, parfaitement lavé, repassé et plié. Service pour particuliers et professionnels.',
      objectif: ['Chemises & Pantalons', 'Linge de maison', 'Service B2B'],
      icone: Shirt,
      price: 2500,
      unit: "kg",
      color: "bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-400"
    },
    {
      id: '3',
      nom: 'Retouche & Couture',
      description: 'Ajustements, réparations et modifications par des mains expertes. Redonnez vie à vos vêtements.',
      objectif: ['Ajustements sur mesure', 'Réparations', 'Modifications créatives'],
      icone: Scissors,
      price: 3000,
      unit: "pièce",
      color: "bg-orange-50 text-orange-500 dark:bg-orange-950/40 dark:text-orange-400"
    },
    {
      id: '4',
      nom: 'Repassage',
      description: 'Repassage professionnel sur table aspirante et soufflante pour un fini impeccable, sans faux plis.',
      objectif: ['Chemises & Pantalons', 'Draps & Nappes', 'Service rapide'],
      icone: Waves,
      price: 2000,
      unit: "pièce",
      color: "bg-teal-50 text-teal-500 dark:bg-teal-950/40 dark:text-teal-400"
    },
    {
      id: '6',
      nom: 'Service Entreprise',
      description: "Prise en charge globale et entretien d'uniformes, nappes, serviettes et linge professionnel.",
      objectif: ['Hôtels & Hébergements', 'Restaurants & Cafés', 'Salles de sport & Spas'],
      icone: Briefcase,
      price: 15000,
      unit: "contrat",
      color: "bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400"
    },
  ];

  // 2️⃣ États des quantités
  const [quantities, setQuantities] = useState(
    servicesList.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {})
  );

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // ✅ NOUVEAU : message d'erreur

  // 3️⃣ Fonctions de manipulation des quantités
  const increment = (id) => {
    setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };
  const decrement = (id) => {
    setQuantities(prev => ({ ...prev, [id]: prev[id] > 0 ? prev[id] - 1 : 0 }));
  };
  const removeService = (id) => {
    setQuantities(prev => ({ ...prev, [id]: 0 }));
  };

  // ✅ Efface l'erreur dès qu'une quantité change
  useEffect(() => {
    setErrorMsg('');
  }, [quantities]);

  // 4️⃣ Calculs (subtotal, discount, total, etc.)
  const subtotalBase = servicesList.reduce((acc, s) => acc + (quantities[s.id] * s.price), 0);
  const discount = isSubscribed ? subtotalBase * 0.1 : 0;
  const subtotal = subtotalBase - discount;
  const deliveryFee = subtotal > 0 && subtotal < 20000 ? 2000 : 0;
  const total = subtotal + deliveryFee;
  
  const freeDeliveryThreshold = 20000;
  const missingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercentage = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const selectedItemsCount = Object.values(quantities).filter(q => q > 0).length;

  const handleNext = () => {
    if (selectedItemsCount === 0) {
      setErrorMsg('Veuillez sélectionner au moins un service.'); // ✅ Affichage du message
      return;
    }
  
    // ⚠️ On retire les icônes (non sérialisables)
    const servicesSansIcones = servicesList.map(({ icone, ...rest }) => rest);
  
    navigate('/client/paiement', {
      state: {
        quantities,
        services: servicesSansIcones,
        subtotalBase,
        discount,
        subtotal,
        deliveryFee,
        total,
        isSubscribed,
      }
    });
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
                    {/* Indicateur de coche */}
                    <div className="absolute top-5 right-5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${service.color}`}>
                        <Icone className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{service.nom}</h3>
                        <p className="text-blue-600 dark:text-blue-400 font-extrabold text-sm mt-1">
                          {service.price.toLocaleString()} <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">FC / {service.unit}</span>
                        </p>
                        <p className="text-slate-400 dark:text-slate-400 text-xs mt-2 font-normal leading-relaxed line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {service.objectif.map((obj, i) => (
                            <span key={i} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 targets-badge">
                              {obj}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

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
              {/* Section statut de connexion */}
              <div className="mb-6 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800/40">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.prenom?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          Bonjour, {user.prenom} {user.nom}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">✅ Connecté</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                        navigate('/');
                      }}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Vous n'êtes pas connecté</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Connectez‑vous pour passer commande</p>
                    </div>
                    <button
                      onClick={() => navigate('/login')}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium"
                    >
                      Se connecter
                    </button>
                  </div>
                )}
              </div>

              {/* En-tête du panier */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Votre Panier</h2>
                <span className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                  {selectedItemsCount}
                </span>
              </div>

              {/* Liste des articles sélectionnés */}
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
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {qte} {service.unit} × {service.price.toLocaleString()} FC
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">
                          {(qte * service.price).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">FC</span>
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
                  <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8 font-medium">
                    Votre panier est vide.
                  </p>
                )}
              </div>

              {/* Calculs financiers */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-sm font-medium text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Sous-total brut</span>
                  <span className="font-bold text-slate-900 dark:text-white">{subtotalBase.toLocaleString()} FC</span>
                </div>
                {isSubscribed && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Remise Fidélité (-10%)</span>
                    <span className="font-bold">- {discount.toLocaleString()} FC</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {deliveryFee > 0 ? `${deliveryFee.toLocaleString()} FC` : 'Gratuite'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <span>Total final</span>
                  <span className="text-blue-600 dark:text-blue-400 text-lg font-black">{total.toLocaleString()} FC</span>
                </div>
              </div>

              {/* Jauge de livraison gratuite */}
              <div className="mt-6 bg-blue-50/60 dark:bg-blue-950/20 rounded-2xl p-4 border border-blue-100/60 dark:border-blue-900/30">
                <div className="flex gap-3">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div className="w-full">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Livraison gratuite dès 20 000 FC</h5>
                    {missingForFreeDelivery > 0 ? (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                        Plus que {missingForFreeDelivery.toLocaleString()} FC pour économiser la livraison.
                      </p>
                    ) : (
                      <p className="text-[11px] text-green-600 dark:text-green-400 font-bold mt-0.5">
                        Félicitations ! Frais offerts sur Kinshasa.
                      </p>
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
            </div>

            {/* ✅ AFFICHAGE DU MESSAGE D'ERREUR */}
            {errorMsg && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block"></span>
                {errorMsg}
              </div>
            )}

            {/* CTA Final */}
            <div className="mt-4 space-y-4">
              <StepButton
                action={handleNext}
                label="Continuer"
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