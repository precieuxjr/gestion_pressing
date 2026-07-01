// src/components/OrderDetails.jsx
import { useState } from 'react';

const InfoItem = ({ label, value }) => (
  <div>
    <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</div>
    <div className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">{value}</div>
  </div>
);

const TotalLine = ({ label, value, isBold = false }) => (
  <div className={`flex justify-between ${isBold ? 'font-bold text-sm text-gray-800 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700' : 'text-sm text-gray-600 dark:text-gray-400'}`}>
    <span>{label}</span>
    <span>{value.toLocaleString()} FCFA</span>
  </div>
);

const OrderDetails = ({ order, onClose }) => {
  if (!order) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Aucune commande sélectionnée</div>;
  }

  const services = Array.isArray(order.services) ? order.services : [];

  const totalArticles = services.reduce(
    (sum, service) => sum + (service.prix_total || service.prix_unitaire_scelle * service.quantite || 0),
    0
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const paiementStatut = order.paiement_statut || order.statut_paiement || 'En attente';
  const modePaiement = order.mode_paiement || order.paiement_mode || 'Non renseigné';

  const getStatutBadgeClass = (statut) => {
    const s = statut?.toLowerCase() || '';
    if (s === 'livrée' || s === 'livree') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (s === 'payée' || s === 'payee' || s === 'validé' || s === 'valide') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (s === 'en attente') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    if (s === 'échoué' || s === 'echoue' || s === 'remboursé' || s === 'rembourse') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
      {/* En-tête */}
      <div className="px-4 md:px-6 pt-5 pb-3 flex flex-wrap justify-between items-baseline gap-2 border-b border-gray-100 dark:border-gray-700">
        <div className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
          Commande {order.reference || order.id?.substring(0, 8)}
        </div>
        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatutBadgeClass(order.statut)}`}>
          {order.statut || 'N/A'}
        </div>
      </div>

      {/* Contenu */}
      <div className="px-4 md:px-6 py-5">
        {/* Client */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors">
          <div>
            <h4 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">Client</h4>
            <div className="font-bold text-sm text-gray-800 dark:text-white mb-1">
              {order.client || 'Client inconnu'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              {order.telephone || '—'}<br />
              {order.email || '—'}
            </div>
          </div>
        </div>

        {/* Infos commande */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-5 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 transition-colors">
          <InfoItem label="Date de dépôt" value={formatDate(order.depositDate)} />
          <InfoItem label="Date prévue" value={formatDate(order.expectedDate)} />
          <InfoItem label="Adresse collecte" value={order.adresse_collecte || '—'} />
          <InfoItem label="Adresse livraison" value={order.adresse_livraison || '—'} />
          <div className="col-span-1 md:col-span-2">
            <InfoItem label="Note" value={order.note_client || 'Aucune note'} />
          </div>
        </div>

        {/* Liste des services */}
        <div className="font-semibold text-sm text-gray-800 dark:text-white mb-2">
          Articles ({services.reduce((sum, s) => sum + (s.quantite || 1), 0)})
        </div>
        <div className="space-y-3 mb-3">
          {services.map((service, idx) => (
            <div key={idx} className="border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
              <div className="flex flex-col sm:flex-row justify-between text-sm gap-1">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {service.service_nom || service.nom}
                  </span>
                  <span className="font-normal text-gray-500 dark:text-gray-400"> × {service.quantite || 1}</span>
                  {service.description && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{service.description}</div>
                  )}
                </div>
                <div className="font-medium text-gray-800 dark:text-white whitespace-nowrap">
                  {(service.prix_total ||
                    (service.prix_unitaire_scelle || service.prix) * (service.quantite || 1)
                  ).toLocaleString()}{' '}
                  FCFA
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totaux */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1">
          <TotalLine label="Total articles" value={totalArticles} />
          <TotalLine label="Remise" value={0} />
          <TotalLine label="Total" value={totalArticles} isBold />
        </div>

        {/* Paiement */}
        <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-semibold text-sm text-gray-800 dark:text-white mb-3">💳 Informations de paiement</h4>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm transition-colors">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Montant total facturé</span>
              <p className="font-bold text-gray-900 dark:text-white">{totalArticles.toLocaleString()} FCFA</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Mode de paiement</span>
              <p className="font-medium text-gray-800 dark:text-gray-200">{modePaiement}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Statut du paiement</span>
              <p className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getStatutBadgeClass(paiementStatut)}`}>
                {paiementStatut}
              </p>
            </div>
            {order.transaction_id && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Transaction ID</span>
                <p className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">{order.transaction_id}</p>
              </div>
            )}
          </div>
        </div>

        {/* Livreur assigné (si présent) */}
        {order.livreur_nom && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">Livreur assigné :</span>
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-200 ml-2">
              {order.livreur_nom}
            </span>
          </div>
        )}
      </div>

      {/* Bouton de fermeture (optionnel, si vous voulez un bouton explicite) */}
      {onClose && (
        <div className="px-4 md:px-6 pb-6 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-full py-2.5 text-sm font-semibold transition"
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;