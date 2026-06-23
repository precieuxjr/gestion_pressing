const OrderDetails = ({ order}) => {
  console.log('📦 OrderDetails reçu :', order);

  if (!order) {
    return <div className="p-6 text-center text-gray-500">Aucune commande sélectionnée</div>;
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

  const paiementStatut = order.paiement_statut || order.statut_paiement || 'Eente';
  const modePaiement = order.mode_paiement || order.paiement_mode || 'Non renseigné';

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* En-tête */}
      <div className="px-6 pt-5 pb-3 flex justify-between items-baseline border-b border-gray-100">
        <div className="text-xl font-bold text-slate-800">
          Commande {order.reference || order.id?.substring(0, 8)}
        </div>
        <div
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            order.statut === 'Livrée'
              ? 'bg-green-100 text-green-800'
              : order.statut === 'Payée'
              ? 'bg-blue-100 text-blue-800'
              : order.statut === 'En attente'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {order.statut || 'N/A'}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-6 py-5">
        {/* Client */}
        <div className="bg-slate-50 rounded-xl p-4 mb-5 flex justify-between items-center">
          <div>
            <h4 className="text-[11px] font-semibold text-slate-500 mb-1">Client</h4>
            <div className="font-bold text-sm text-slate-800 mb-1">
              {order.client || 'Client inconnu'}
            </div>
            <div className="text-xs text-slate-600">
              {order.phone || '—'}<br />
              {order.email || '—'}
            </div>
          </div>
          <button className="bg-white border border-slate-300 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-slate-50">
            Voir le profil →
          </button>
        </div>

        {/* Infos commande */}
        <div className="border border-slate-100 rounded-xl p-4 mb-5 grid grid-cols-2 gap-x-4 gap-y-3">
          <InfoItem label="Date de dépôt" value={formatDate(order.depositDate)} />
          <InfoItem label="Date prévue" value={formatDate(order.expectedDate)} />
          <InfoItem label="Adresse collecte" value={order.adresse_collecte || '—'} />
          <InfoItem label="Adresse livraison" value={order.adresse_livraison || '—'} />
          <div className="col-span-2">
            <InfoItem label="Note" value={order.note_client || 'Aucune note'} />
          </div>
        </div>

        {/* Liste des services */}
        <div className="font-semibold text-sm text-slate-800 mb-2">
          Articles ({services.reduce((sum, s) => sum + (s.quantite || 1), 0)})
        </div>
        <div className="space-y-3 mb-3">
          {services.map((service, idx) => (
            <div key={idx} className="border-b border-slate-50 pb-2 last:border-0 last:pb-0">
              <div className="flex justify-between text-sm">
                <div>
                  <span className="font-medium text-slate-700">
                    {service.service_nom || service.nom}
                  </span>
                  <span className="font-normal text-slate-500"> × {service.quantite || 1}</span>
                  {service.description && (
                    <div className="text-xs text-slate-400 mt-0.5">{service.description}</div>
                  )}
                </div>
                <div className="font-medium text-slate-800">
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
        <div className="border-t border-slate-100 pt-3 space-y-1">
          <TotalLine label="Total articles" value={totalArticles} />
          <TotalLine label="Remise" value={0} />
          <TotalLine label="Total" value={totalArticles} isBold />
        </div>

        {/* --- SECTION PAIEMENT (ajoutée en bas) --- */}
        <div className="mt-5 border-t border-slate-200 pt-4">
          <h4 className="font-semibold text-sm text-slate-800 mb-3">💳 Informations de paiement</h4>
          <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <div>
              <span className="text-slate-500">Montant total facturé</span>
              <p className="font-bold text-slate-900">{totalArticles.toLocaleString()} FCFA</p>
            </div>
            <div>
              <span className="text-slate-500">Mode de paiement</span>
              <p className="font-medium text-slate-800">{modePaiement}</p>
            </div>
            <div>
              <span className="text-slate-500">Statut du paiement</span>
              <p
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                  paiementStatut === 'Payé' || paiementStatut === 'Validé'
                    ? 'bg-green-100 text-green-800'
                    : paiementStatut === 'En attente'
                    ? 'bg-yellow-100 text-yellow-800'
                    : paiementStatut === 'Échoué' || paiementStatut === 'Remboursé'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {paiementStatut}
              </p>
            </div>
            {order.transaction_id && (
              <div>
                <span className="text-slate-500">Transaction ID</span>
                <p className="font-mono text-xs text-slate-700">{order.transaction_id}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="px-6 pb-6 pt-3 flex gap-3 border-t border-slate-100">
        <button className="flex-1 bg-white border border-slate-300 rounded-full py-2.5 text-sm font-semibold hover:bg-slate-50 transition">
          Imprimer le ticket
        </button>
        <button className="flex-1 bg-blue-500 rounded-full py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition">
          Marquer comme livrée
        </button>
      </div>
    </div>
  );
};

// Composants auxiliaires (inchangés)
const InfoItem = ({ label, value }) => (
  <div>
    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{label}</div>
    <div className="text-sm font-medium text-slate-800">{value}</div>
  </div>
);

const TotalLine = ({ label, value, isBold = false }) => (
  <div className={`flex justify-between ${isBold ? 'font-bold text-sm text-slate-800 pt-2 border-t border-slate-100' : 'text-sm text-slate-600'}`}>
    <span>{label}</span>
    <span>{value.toLocaleString()} FCFA</span>
  </div>
);

export default OrderDetails;

