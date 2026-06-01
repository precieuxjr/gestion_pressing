import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, X } from 'lucide-react';
import NotificationIcon from '../components/notifiocations';
import OrderDetails from '../components/OrderDetails';
import { commandesService } from '../services/commandes'; // ← L'import DOIT être en haut

const STATUS_OPTIONS = ['En cours', 'Prête à retirer', 'Livrée'];

export default function Commandes() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Récupérer toutes les commandes
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await commandesService.getAll();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Détails d'une commande - UNE SEULE DÉCLARATION
  const getOrderDetails = useCallback(async (orderId) => {
    try {
      const details = await commandesService.getById(orderId);
      setSelectedOrder(details);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Mise à jour du statut - UNE SEULE DÉCLARATION
  const updateStatus = useCallback(async (orderId, newStatus) => {
    try {
      await commandesService.updateStatus(orderId, newStatus);
      await fetchOrders(); // Rafraîchit la liste
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch (err) {
      console.error(err);
    }
  }, [fetchOrders, selectedOrder]);

  // Chargement initial
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filtrage des commandes
  const filteredOrders = orders.filter((order) => {
    const client = (order.client || order.nomClient || '').toLowerCase();
    const id = (order.id || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return client.includes(term) || id.includes(term);
  });

  const handleOrderClick = (orderId) => getOrderDetails(orderId);
  const handleCloseDetails = () => setSelectedOrder(null);

  return (
    <section className="flex flex-col bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white w-full h-14 flex items-center justify-between my-0.5 px-4 gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 w-80 md:w-96 h-10 px-3 ml-0 md:ml-15">
          <Search className="text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-xs text-gray-700 bg-transparent"
            placeholder="Recherchez une commande, un client..."
          />
        </div>
        <div className="flex items-center gap-3">
          <NotificationIcon />
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" />
            Nouvelle Commande
          </button>
        </div>
      </header>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des commandes</h1>
        <div className="flex gap-6">
          {/* Tableau des commandes */}
          <div className={`${selectedOrder ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Toutes les commandes</h2>
                <div className="flex gap-2">
                  <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1">Filtrer</button>
                  <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1">Exporter</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                {loading && <div className="text-center py-4">Chargement des commandes...</div>}
                {error && <div className="text-red-600 text-center py-4">{error}</div>}
                {!loading && !error && (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3"><input type="checkbox" /></th>
                        <th className="px-4 py-3 text-left">Réf.</th>
                        <th className="px-4 py-3 text-left">Client</th>
                        <th className="px-4 py-3 text-left">Tél.</th>
                        <th className="px-4 py-3 text-left">Dépôt</th>
                        <th className="px-4 py-3 text-left">Prévue</th>
                        <th className="px-4 py-3 text-left">Montant</th>
                        <th className="px-4 py-3 text-left">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          onClick={() => handleOrderClick(order.id)}
                          className={`hover:bg-gray-50 cursor-pointer ${selectedOrder?.id === order.id ? 'bg-blue-50' : ''}`}
                        >
                          <td className="px-4 py-3">
                            <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                          </td>
                          <td className="px-4 py-3 font-semibold text-sm">{order.id}</td>
                          <td className="px-4 py-3 text-sm">{order.client || order.nomClient || '—'}</td>
                          <td className="px-4 py-3 text-sm">{order.phone || '—'}</td>
                          <td className="px-4 py-3 text-sm">{order.depositDate || '—'}</td>
                          <td className="px-4 py-3 text-sm">{order.expectedDate || '—'}</td>
                          <td className="px-4 py-3 text-sm font-medium">
                            {order.amount ? `${order.amount} €` : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                              className="text-xs px-2 py-1 rounded-full border"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt}>{opt}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Panneau de détails */}
          {selectedOrder && (
            <div className="w-1/2 transition-all duration-300 relative">
              <button
                onClick={handleCloseDetails}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-10"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <OrderDetails order={selectedOrder} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}