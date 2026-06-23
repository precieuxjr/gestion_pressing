// src/pages/client/Paiement.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Sparkles, Shirt, Scissors, Waves, Briefcase, Package
} from 'lucide-react';
import { clientService } from '../services/clientService'; // ✅ chemin corrigé

// ✅ Mapping des icônes (déclaré AVANT le composant)
const iconMap = {
  nettoyageSec: Sparkles,
  blanchisserie: Shirt,
  retoucheCouture: Scissors,
  repassage: Waves,
  livraisonExpress: Truck,
  serviceEntreprise: Briefcase,
};

export default function Paiement() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartState = location.state || {};

  const {
    quantities = {},
    services = [],
    subtotalBase = 0,
    discount = 0,
    subtotal = 0,
    deliveryFee = 0,
    total = 0,
    isSubscribed = false,
  } = cartState;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [confirmationId, setConfirmationId] = useState(null);

  const [formData, setFormData] = useState({
    adresse_collecte: '',
    adresse_livraison: '',
    mode_paiement: 'Mobile money',
    date_livraison_souhaitee: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (!services.length || !quantities || Object.keys(quantities).length === 0) {
      navigate('/selection', { replace: true });
    }
  }, [services, quantities, navigate]);

  // ✅ selectedItems utilise iconMap qui est maintenant défini
  const selectedItems = services
    .filter((s) => quantities[s.id] && quantities[s.id] > 0)
    .map((s) => ({
      ...s,
      quantity: quantities[s.id],
      lineTotal: quantities[s.id] * s.price,
      icone: iconMap[s.id] || Package,
    }));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const orderData = {
        services: selectedItems.map((item) => ({
          service_id: item.id,
          quantite: item.quantity,
          prix_unitaire: item.price,
        })),
        adresse_collecte: formData.adresse_collecte,
        adresse_livraison: formData.adresse_livraison,
        mode_paiement: formData.mode_paiement,
        date_livraison_souhaitee: formData.date_livraison_souhaitee,
        notes: formData.notes,
      };
      const response = await clientService.creerCommande(orderData);
      setSuccess(true);
      setConfirmationId(response.data?.public_id || response.public_id);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Commande confirmée !</h2>
          <p className="text-gray-600 mt-2">Votre commande a été enregistrée avec succès.</p>
          {confirmationId && (
            <p className="text-sm text-gray-500 mt-1">
              Référence : <span className="font-mono">{confirmationId}</span>
            </p>
          )}
          <button
            onClick={() => navigate('/client/dashboard')}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Voir mes commandes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Paiement & confirmation</h1>
          <p className="text-gray-500 text-sm mt-1">Renseignez vos informations pour finaliser la commande.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Articles sélectionnés</h2>
              {selectedItems.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Aucun article.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                          <item.icone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.nom}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × {item.price.toLocaleString()} FC
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        {item.lineTotal.toLocaleString()} FC
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h2 className="font-semibold text-gray-800 mb-2">Informations de livraison</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de collecte *</label>
                  <input
                    type="text"
                    name="adresse_collecte"
                    placeholder="Ex: 12 Av. des Fleurs, Kinshasa"
                    value={formData.adresse_collecte}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison *</label>
                  <input
                    type="text"
                    name="adresse_livraison"
                    placeholder="Ex: 45 Rue du Commerce, Lubumbashi"
                    value={formData.adresse_livraison}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
                  <select
                    name="mode_paiement"
                    value={formData.mode_paiement}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Carte">Carte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date souhaitée de livraison</label>
                  <input
                    type="date"
                    name="date_livraison_souhaitee"
                    value={formData.date_livraison_souhaitee}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
                  <textarea
                    name="notes"
                    placeholder="Instructions particulières..."
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || selectedItems.length === 0}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all ${
                  loading || selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Confirmation en cours...
                  </span>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Confirmer la commande
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/60 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col justify-between sticky top-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Récapitulatif</h2>
                  <span className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                    {selectedItems.length}
                  </span>
                </div>

                <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1 text-sm">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-700 dark:text-slate-300">{item.nom} × {item.quantity}</span>
                      <span className="font-medium text-slate-900 dark:text-white">{item.lineTotal.toLocaleString()} FC</span>
                    </div>
                  ))}
                  {selectedItems.length === 0 && (
                    <p className="text-slate-400 dark:text-slate-500 text-center py-4 text-xs">Panier vide</p>
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-bold text-slate-900 dark:text-white">{subtotalBase.toLocaleString()} FC</span>
                  </div>
                  {isSubscribed && discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Remise (-10%)</span>
                      <span>- {discount.toLocaleString()} FC</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {deliveryFee > 0 ? `${deliveryFee.toLocaleString()} FC` : 'Gratuite'}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">{total.toLocaleString()} FC</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Paiement sécurisé
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}