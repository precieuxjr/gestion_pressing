const OrderDetails = ({ order }) => {
  console.log('📦 OrderDetails reçu :', order);

  if (!order) {
    console.warn('⚠️ OrderDetails : order est null/undefined');
    return <div className="p-6 text-center text-gray-500">Aucune commande sélectionnée</div>;
  }

  // ✅ FORCER un tableau vide si services n'existe pas ou n'est pas un tableau
  const services = Array.isArray(order.services) ? order.services : [];
  
  if (services.length === 0) {
    console.warn('⚠️ Aucun service trouvé pour cette commande');
  }

  // Calcul du total
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
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 pt-5 pb-3 flex justify-between items-baseline border-b border-gray-100">
        <div className="text-xl font-bold text-slate-800">
          Commande {order.reference || order.id?.substring(0, 8)}
        </div>
        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
          order.status === 'Livrée' ? 'bg-green-100 text-green-800' :
          order.status === 'Payée' ? 'bg-blue-100 text-blue-800' :
          order.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {order.status || 'En attente'}
        </div>
      </div>

      <div className="flex gap-5 px-6 pt-3 border-b border-slate-100">
        {['Articles', 'Paiement', 'Historique'].map((tab, idx) => (
          <div key={tab} className={`text-sm font-medium pb-2 border-b-2 cursor-default ${
            idx === 0 ? 'text-blue-500 border-blue-500' : 'text-slate-500 border-transparent'
          }`}>
            {tab}
          </div>
        ))}
      </div>

      <div className="px-6 py-5">
        {/* Client */}
        <div className="bg-slate-50 rounded-xl p-4 mb-5 flex justify-between items-center">
          <div>
            <h4 className="text-[11px] font-semibold text-slate-500 mb-1">Client</h4>
            <div className="font-bold text-sm text-slate-800 mb-1">{order.client || 'Client inconnu'}</div>
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

        {/* Liste articles */}
        <div className="font-semibold text-sm text-slate-800 mb-2">
          Articles ({services.reduce((sum, s) => sum + (s.quantite || 1), 0)})
        </div>
        <div className="space-y-2 mb-3">
          {services.map((service, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <div className="font-medium text-slate-700">
                {service.service_nom || service.nom} 
                <span className="font-normal text-slate-500"> × {service.quantite || 1}</span>
              </div>
              <div className="font-medium text-slate-800">
                {(service.prix_total || (service.prix_unitaire_scelle || service.prix) * (service.quantite || 1)).toLocaleString()} FCFA
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
      </div>

      <div className="px-6 pb-6 pt-3 flex gap-3">
        <button className="flex-1 bg-white border border-slate-300 rounded-full py-2.5 text-sm font-semibold hover:bg-slate-50">
          Imprimer le ticket
        </button>
        <button className="flex-1 bg-blue-500 rounded-full py-2.5 text-sm font-semibold text-white hover:bg-blue-600">
          Marquer comme livrée
        </button>
      </div>
    </div>
  );
};

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