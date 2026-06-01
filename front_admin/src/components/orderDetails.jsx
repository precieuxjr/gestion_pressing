

const OrderDetails = ({ order }) => {
  // Données par défaut si aucune prop n'est fournie
  const defaultOrder = {
    id: 'CMD-00031',
    status: 'Prête à retirer',
    client: {
      name: 'Julien Dubois',
      phone: '06 98 76 54 32',
      email: 'julien.dubois@email.com'
    },
    depositDate: '11/05/2024 à 10:30',
    expectedDate: '13/05/2024 à 18:00',
    service: 'Repassage',
    note: 'Aucune note',
    articles: [
      { name: 'Chemise', quantity: 2, price: 8.00 },
      { name: 'Pantalon', quantity: 1, price: 6.00 },
      { name: 'Robe', quantity: 1, price: 10.00 },
      { name: 'Veste', quantity: 1, price: 4.50 }
    ],
    discount: 0.00,
    pagination: { start: 1, end: 8, total: 32 }
  };

  const data = order || defaultOrder;
  
  const totalArticles = data.articles.reduce(
    (sum, article) => sum + article.price, 
    0
  );
  const finalTotal = totalArticles - data.discount;

  return (
    <div className="max-w-130 w-full bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* En-tête */}
      <div className="px-6 pt-5 pb-3 flex justify-between items-baseline border-b border-gray-100">
        <div className="text-xl font-bold text-slate-800 tracking-tight">
          Commande {data.id}
        </div>
        <div className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
          {data.status}
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-5 px-6 pt-3 border-b border-slate-100">
        {['Articles', 'Paiement', 'Historique'].map((tab, idx) => (
          <div
            key={tab}
            className={`text-sm font-medium pb-2 border-b-2 cursor-default ${
              idx === 0
                ? 'text-blue-500 border-blue-500'
                : 'text-slate-500 border-transparent'
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Corps */}
      <div className="px-6 py-5">
        {/* Client */}
        <div className="bg-slate-50 rounded-xl p-4 mb-5 flex justify-between items-center">
          <div>
            <h4 className="text-[11px] font-semibold text-slate-500 tracking-wide mb-1">
              Client
            </h4>
            <div className="font-bold text-sm text-slate-800 mb-1">
              {data.client.name}
            </div>
            <div className="text-xs text-slate-600">
              {data.client.phone}<br />
              {data.client.email}
            </div>
          </div>
          <button className="bg-white border border-slate-300 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
            Voir le profil →
          </button>
        </div>

        {/* Infos commande */}
        <div className="border border-slate-100 rounded-xl p-4 mb-5 grid grid-cols-2 gap-x-4 gap-y-3">
          <InfoItem label="Date de dépôt" value={data.depositDate} />
          <InfoItem label="Date prévue" value={data.expectedDate} />
          <InfoItem label="Service" value={data.service} />
          <InfoItem label="Statut" value={data.status} />
          <div className="col-span-2">
            <InfoItem label="Note" value={data.note} />
          </div>
        </div>

        {/* Liste articles */}
        <div className="font-semibold text-sm text-slate-800 mb-2">
          Articles ({data.articles.reduce((sum, a) => sum + a.quantity, 0)})
        </div>
        
        <div className="space-y-2 mb-3">
          {data.articles.map((article, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <div className="font-medium text-slate-700">
                {article.name}{' '}
                <span className="font-normal text-slate-500">× {article.quantity}</span>
              </div>
              <div className="font-medium text-slate-800">
                {article.price.toFixed(2)} €
              </div>
            </div>
          ))}
        </div>

        {/* Totaux */}
        <div className="border-t border-slate-100 pt-3 space-y-1">
          <TotalLine label="Total articles" value={totalArticles} />
          <TotalLine label="Remise" value={data.discount} />
          <TotalLine label="Total" value={finalTotal} isBold />
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 text-xs text-slate-500 border-t border-slate-100">
        {data.pagination.start} – {data.pagination.end} sur {data.pagination.total} commandes
      </div>

      {/* Boutons */}
      <div className="px-6 pb-6 pt-3 flex gap-3">
        <button className="flex-1 bg-white border border-slate-300 rounded-full py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
          Imprimer le ticket
        </button>
        <button className="flex-1 bg-blue-500 rounded-full py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition">
          Marquer comme livrée
        </button>
      </div>
    </div>
  );
};

// Composants utilitaires
const InfoItem = ({ label, value }) => (
  <div>
    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
      {label}
    </div>
    <div className="text-sm font-medium text-slate-800">{value}</div>
  </div>
);

const TotalLine = ({ label, value, isBold = false }) => (
  <div
    className={`flex justify-between ${
      isBold
        ? 'font-bold text-sm text-slate-800 pt-2 border-t border-slate-100'
        : 'text-sm text-slate-600'
    }`}
  >
    <span>{label}</span>
    <span>{value.toFixed(2)} €</span>
  </div>
);

export default OrderDetails;