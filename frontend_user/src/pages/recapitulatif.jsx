// src/pages/client/Recapitulatif.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Shirt,
  Truck,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Package,
} from 'lucide-react';
import { clientService } from '../services/clientService';

export default function Recapitulatif() {
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

  // Si pas de données ou panier vide → redirection vers la page de sélection
  useEffect(() => {
    if (!services.length || !quantities || Object.keys(quantities).length === 0) {
      navigate('/selection', { replace: true });
    }
  }, [services, quantities, navigate]);

  // Services sélectionnés
  const selectedItems = services
    .filter((s) => quantities[s.id] && quantities[s.id] > 0)
    .map((s) => ({
      ...s,
      quantity: quantities[s.id],
      lineTotal: quantities[s.id] * s.price,
    }));

  // Confirmation de la commande
  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderData = {
        services: selectedItems.map((item) => ({
          service_id: item.id,
          quantite: item.quantity,
          prix_unitaire: item.price,
        })),
        adresse_collecte: '',
        adresse_livraison: '',
        mode_paiement: 'Espèces',
        date_livraison_souhaitee: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        notes: '',
      };

      // ✅ Utilisation du service client
      const response = await clientService.creerCommande(orderData);
      setSuccess(true);
      setConfirmationId(response.data?.public_id || response.public_id);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  // Succès
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
      <div className="max-w-3xl mx-auto px-4">
        {/* Retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Récapitulatif de la commande</h1>
          <p className="text-gray-500 text-sm mt-1">Vérifiez les détails avant de confirmer.</p>
        </div>

        {/* Articles */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Articles sélectionnés</h2>
          {selectedItems.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Aucun article sélectionné.</p>
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

        {/* Coûts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Résumé des coûts</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Sous-total</span>
              <span className="font-medium">{subtotal.toLocaleString()} FC</span>
            </div>
            {isSubscribed && discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Remise fidélité (-10%)</span>
                <span>- {discount.toLocaleString()} FC</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Livraison</span>
              <span className="font-medium">
                {deliveryFee > 0 ? `${deliveryFee.toLocaleString()} FC` : 'Gratuite'}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-blue-600">{total.toLocaleString()} FC</span>
            </div>
          </div>
        </div>

        {/* Livraison */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Informations de livraison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Adresse de collecte"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              defaultValue=""
            />
            <input
              type="text"
              placeholder="Adresse de livraison"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              defaultValue=""
            />
            <select className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="Espèces">Espèces</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Carte">Carte</option>
            </select>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0]}
            />
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Confirmer */}
        <button
          onClick={handleConfirm}
          disabled={loading || selectedItems.length === 0}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all ${
            loading || selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              Confirmation...
            </span>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Confirmer la commande
            </>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4" />
          Vos données sont sécurisées
        </div>
      </div>
    </div>
  );
}