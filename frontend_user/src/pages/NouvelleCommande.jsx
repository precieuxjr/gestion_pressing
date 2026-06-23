// src/pages/client/NouvelleCommande.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Shirt,
  Scissors,
  Waves,
  Truck,
  Briefcase,
  Check,
  ShieldCheck,
  Plus,
  Package,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { clientService } from '../services/clientService';
const SERVICES_LIST = [
    {
      id: 'nettoyageSec',
      numeric_id: 1,  
      nom: 'Nettoyage à sec',
      description: 'Nettoyage professionnel pour costumes, robes de soirée et textiles délicats.',
      objectif: ['Costumes', 'Robes', 'Textiles délicats'],
      icone: Sparkles,
      price: 4000,
      unit: 'pièce',
      color: 'bg-purple-50 text-purple-500 dark:bg-purple-950/40 dark:text-purple-400',
    },
    {
      id: 'blanchisserie',
      numeric_id: 2,  
      nom: 'Blanchisserie',
      description: 'Du linge impeccable, parfaitement lavé, repassé et plié.',
      objectif: ['Chemises', 'Linge de maison', 'B2B'],
      icone: Shirt,
      price: 2500,
      unit: 'kg',
      color: 'bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-400',
    },
    {
      id: 'retoucheCouture',
      numeric_id: 3,  
      nom: 'Retouche & Couture',
      description: 'Ajustements, réparations et modifications par des mains expertes.',
      objectif: ['Ajustements', 'Réparations', 'Modifications'],
      icone: Scissors,
      price: 3000,
      unit: 'pièce',
      color: 'bg-orange-50 text-orange-500 dark:bg-orange-950/40 dark:text-orange-400',
    },
    {
      id: 'repassage',
      numeric_id: 4,  
      nom: 'Repassage',
      description: 'Repassage professionnel sur table aspirante et soufflante.',
      objectif: ['Chemises', 'Pantalons', 'Draps'],
      icone: Waves,
      price: 2000,
      unit: 'pièce',
      color: 'bg-teal-50 text-teal-500 dark:bg-teal-950/40 dark:text-teal-400',
    },
 
    {
      id: 'serviceEntreprise',
      numeric_id: 5,  
      nom: 'Service Entreprise',
      description: 'Prise en charge globale d’uniformes, nappes, linge professionnel.',
      objectif: ['Hôtels', 'Restaurants', 'Spas'],
      icone: Briefcase,
      price: 15000,
      unit: 'contrat',
      color: 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400',
    },
  ];
export default function NouvelleCommande() {
  const navigate = useNavigate();

  // État : quantités par service (stocké par id)
  const [quantities, setQuantities] = useState(
    SERVICES_LIST.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {})
  );
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Informations de livraison
  const [formData, setFormData] = useState({
    adresse_collecte: '',
    adresse_livraison: '',
    mode_paiement: 'Espèces',
    date_livraison_souhaitee: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculs
  const subtotalBase = SERVICES_LIST.reduce(
    (acc, s) => acc + quantities[s.id] * s.price,
    0
  );
  const discount = isSubscribed ? subtotalBase * 0.1 : 0;
  const subtotal = subtotalBase - discount;
  const deliveryFee = subtotal > 0 && subtotal < 20000 ? 2000 : 0;
  const total = subtotal + deliveryFee;
  const selectedItemsCount = Object.values(quantities).filter((q) => q > 0).length;

  // Utilitaires
  const increment = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  const decrement = (id) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0,
    }));
  const removeService = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: 0 }));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItemsCount === 0) {
      toast.error('Veuillez sélectionner au moins un service.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Préparer la liste des services pour l'API
      const servicesPayload = SERVICES_LIST.filter(
        (s) => quantities[s.id] > 0
      ).map((s) => ({
        service_id: s.numeric_id,   // ← envoie l'ID numérique
        quantite: quantities[s.id],
        prix_unitaire: s.price,
      }));

      const payload = {
        services: servicesPayload,
        adresse_collecte: formData.adresse_collecte,
        adresse_livraison: formData.adresse_livraison,
        mode_paiement: formData.mode_paiement,
        date_livraison_souhaitee: formData.date_livraison_souhaitee,
        notes: formData.notes,
      };

      await clientService.creerCommande(payload);
      toast.success('Commande créée avec succès !');
      navigate('/client/dashboard');
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec bouton retour */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Nouvelle commande
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche : Sélection des services (2/3) */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Sélectionnez vos services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICES_LIST.map((service) => {
                  const qte = quantities[service.id];
                  const isSelected = qte > 0;
                  const Icon = service.icone;
                  return (
                    <div
                      key={service.id}
                      className={`relative rounded-xl border-2 p-4 transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${service.color}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                            {service.nom}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {service.description}
                          </p>
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">
                            {service.price.toLocaleString()} FC / {service.unit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => decrement(service.id)}
                          disabled={qte === 0}
                          className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center"
                        >
                          –
                        </button>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {qte}
                        </span>
                        <button
                          onClick={() => increment(service.id)}
                          className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <Check className="w-4 h-4 text-blue-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Informations de livraison */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mt-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Informations de livraison
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Adresse de collecte *
                  </label>
                  <input
                    type="text"
                    name="adresse_collecte"
                    value={formData.adresse_collecte}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 12 Avenue des Fleurs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Adresse de livraison *
                  </label>
                  <input
                    type="text"
                    name="adresse_livraison"
                    value={formData.adresse_livraison}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 45 Rue du Commerce"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Mode de paiement
                    </label>
                    <select
                      name="mode_paiement"
                      value={formData.mode_paiement}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Carte">Carte</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Date souhaitée
                    </label>
                    <input
                      type="date"
                      name="date_livraison_souhaitee"
                      value={formData.date_livraison_souhaitee}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Notes (optionnel)
                  </label>
                  <textarea
                    name="notes"
                    rows="2"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Instructions particulières..."
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Colonne droite : Récapitulatif (1/3) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                Votre panier
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-full">
                  {selectedItemsCount}
                </span>
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {SERVICES_LIST.map((s) => {
                  const qte = quantities[s.id];
                  if (qte === 0) return null;
                  const Icon = s.icone;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${s.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {s.nom} × {qte}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {(qte * s.price).toLocaleString()} FC
                      </span>
                    </div>
                  );
                })}
                {selectedItemsCount === 0 && (
                  <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">
                    Aucun service sélectionné.
                  </p>
                )}
              </div>

              <div className="space-y-2 text-sm border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Sous-total</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {subtotalBase.toLocaleString()} FC
                  </span>
                </div>
                {isSubscribed && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Remise fidélité (-10%)</span>
                    <span>- {discount.toLocaleString()} FC</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Livraison</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {deliveryFee > 0 ? `${deliveryFee.toLocaleString()} FC` : 'Gratuite'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-900 dark:text-white">Total</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {total.toLocaleString()} FC
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading || selectedItemsCount === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5" />
                      Confirmer la commande
                    </>
                  )}
                </button>
                {error && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Sécurisé – Paiement à la livraison
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}