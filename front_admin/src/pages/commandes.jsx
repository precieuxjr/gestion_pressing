import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReceiptText, Package, CircleX } from 'lucide-react';
import toast from 'react-hot-toast';
import NavBarHorizontal from '../components/navbar_horizontal';
import OrderDetails from '../components/OrderDetails';
import { commandesService } from '../../src/services/commandes';
import { useParams, useNavigate } from 'react-router-dom';
export default function Commandes() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderData, setSelectedOrderData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Tous');
  const { id: orderIdFromUrl } = useParams();
  const navigate = useNavigate();
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await commandesService.getAll();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOrderClick = async (orderId) => {
    setShowNewOrderForm(false);
    setSelectedOrderData(null);
    setLoadingDetails(true);
    try {
      const data = await commandesService.getById(orderId);
      setSelectedOrderData(data);
    } catch (err) {
      console.error('Erreur chargement détails:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (orderIdFromUrl && !selectedOrderData) {
      handleOrderClick(orderIdFromUrl);
    }
  }, [orderIdFromUrl]);


  const filteredOrders = orders.filter((order) => {
    const client = (order.client || '').toLowerCase();
    const id = (order.id || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchSearch = client.includes(term) || id.includes(term);
    const matchStatus = statusFilter === 'Tous' || order.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const handleCloseDetails = () => {
    setSelectedOrderData(null);
    if (orderIdFromUrl) {
      navigate('/admin/commandes', { replace: true });
    }
  };
  const handleOrderCreated = () => {
    setShowNewOrderForm(false);
    fetchOrders();
    toast.success('Commande créée avec succès');
  };

  const [statis, setStats] = useState({
    total: 0,
    payees: 0,
    annulees: 0,
    livrees: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await commandesService.getStats();
        setStats(data);
      } catch (err) {
        toast.error('Erreur chargement statistiques');
      }
    };
    fetchStats();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await commandesService.updateStatus(orderId, newStatus);
      await fetchOrders();
      toast.success('Statut mis à jour');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const stats = [
    {
      id: 1,
      nom: 'Nombre des commandes',
      icon: ReceiptText,
      result: orders.length,
      style:
        'relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-4 shadow-sm border border-blue-100 dark:border-blue-800',
    },
    {
      id: 2,
      nom: 'Commandes Payées',
      icon: ReceiptText,
      result: statis.payees,
      style:
        'relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 p-4 shadow-sm border border-green-100 dark:border-green-800',
    },
    {
      id: 3,
      nom: 'Commandes annulées',
      icon: CircleX,
      result: statis.annulees,
      style:
        'relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-900/20 p-4 shadow-sm border border-red-100 dark:border-red-800',
    },
    {
      id: 4,
      nom: 'Commandes à livrer',
      icon: Package,
      result: statis.livrees,
      style:
        'relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 p-4 shadow-sm border border-purple-100 dark:border-purple-800',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
  };

  // Variants pour l’animation du modal
  const modalVariants = {
    hidden: { scale: 0.9, y: 20, opacity: 0 },
    visible: { scale: 1, y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { scale: 0.9, y: 20, opacity: 0, transition: { duration: 0.2 } },
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleExportCSV = () => {
    try {
      const headers = ['Référence', 'Client', 'Téléphone', 'Date dépôt', 'Date prévue', 'Montant', 'Statut'];

      const escapeCSV = (value) => {
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const rows = filteredOrders.map((order) => [
        escapeCSV(order.reference || order.id?.substring(0, 8) || ''),
        escapeCSV(order.client || ''),
        escapeCSV(order.phone || ''),
        escapeCSV(order.depositDate ? new Date(order.depositDate).toLocaleDateString('fr-FR') : ''),
        escapeCSV(order.expectedDate ? new Date(order.expectedDate).toLocaleDateString('fr-FR') : ''),
        escapeCSV(order.amount ? `${order.amount.toLocaleString()} FC` : ''),
        escapeCSV(order.status || ''),
      ]);

      const BOM = '\uFEFF';
      const csvContent = BOM + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `commandes_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Export CSV réussi');
    } catch (err) {
      toast.error('Erreur lors de l\'export');
    }
  };

  return (
    <section className="flex flex-col bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
      <NavBarHorizontal
        buttonLabel="Nouvelle commande"
        onButtonClick={() => {
          setShowNewOrderForm(!showNewOrderForm);
          setSelectedOrderData(null);
        }}
        onSearch={handleSearch}
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center mx-3 my-3.5 bg-white dark:bg-gray-800 py-6 px-4"
      >
        {stats.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`${item.style} w-full max-w-xs`}
          >
            <div className="flex justify-between items-start">
              <item.icon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-full">
                Unité
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
              {item.result}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.nom}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des commandes</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Liste des commandes (toujours pleine largeur) */}
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold text-gray-800 dark:text-white">Toutes les commandes</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-xs border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 bg-white dark:bg-gray-700"
                  >
                    <option value="Tous">Tous les statuts</option>
                    <option value="Payée">Payée</option>
                    <option value="Annulée">Annulée</option>
                    <option value="Retirer">Retirer</option>
                    <option value="Prêt">Prêt</option>
                    <option value="En attente">En attente</option>
                    <option value="Livrée">Livrée</option>
                  </select>
                  {statusFilter !== 'Tous' && (
                    <button
                      onClick={() => setStatusFilter('Tous')}
                      className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      Réinitialiser
                    </button>
                  )}
                  <button
                    onClick={handleExportCSV}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1"
                  >
                    Exporter
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                {loading && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Chargement des commandes...
                  </div>
                )}
                {error && (
                  <div className="text-red-600 dark:text-red-400 text-center py-4">{error}</div>
                )}
                {!loading && !error && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                          <tr>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Réf.
                            </th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Client
                            </th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                              Tél.
                            </th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                              Dépôt
                            </th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                              Prévue
                            </th>
                            <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Montant
                            </th>
                            <th className="px-4 md:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Statut
                            </th>
                            <th className="px-4 md:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                              Livraison
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                          {filteredOrders.map((order, index) => (
                            <tr
                              key={order.id}
                              onClick={() => handleOrderClick(order.id)}
                              className={`
                                cursor-pointer transition-all duration-200
                                ${selectedOrderData?.id === order.id && !showNewOrderForm
                                  ? 'bg-blue-50/70 dark:bg-blue-900/30 ring-1 ring-blue-200 dark:ring-blue-700'
                                  : 'hover:bg-gray-50/80 dark:hover:bg-gray-700/50'
                                }
                                ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/30 dark:bg-gray-700/30'}
                              `}
                            >
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {order.reference || order.id?.substring(0, 8)}
                              </td>
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {order.client || '—'}
                              </td>
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                                {order.phone || '—'}
                              </td>
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                                {order.depositDate
                                  ? new Date(order.depositDate).toLocaleDateString('fr-FR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                    })
                                  : '—'}
                              </td>
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                                {order.expectedDate
                                  ? new Date(order.expectedDate).toLocaleDateString('fr-FR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                    })
                                  : '—'}
                              </td>
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white text-right">
                                {order.amount ? `${order.amount.toLocaleString()} FC` : '—'}
                              </td>
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center">
                                <select
                                  value={order.status}
                                  onChange={(e) => updateStatus(order.id, e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  disabled={order.status === 'Livrée'}
                                  className={`
                                    text-xs font-medium px-3 py-1.5 rounded-full border-0
                                    focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
                                    transition-all duration-200 cursor-pointer
                                    ${order.status === 'Payée'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                                      : order.status === 'Annulée'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                                      : order.status === 'Retirer'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                                      : order.status === 'Prêt'
                                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                                      : order.status === 'Livrée'
                                      ? 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300 opacity-75 cursor-not-allowed'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                                    }
                                  `}
                                >
                                  <option value="Annulée">Annulée</option>
                                  <option value="Payée">Payée</option>
                                  <option value="Retirer">Retirer</option>
                                  <option value="Prêt">Prêt</option>
                                </select>
                              </td>
                              <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center hidden lg:table-cell">
                                <span
                                  className={`
                                    text-xs font-medium px-3 py-1.5 rounded-full border-0
                                    ${order.statut_livraison === 'Livrée'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                      : order.statut_livraison === 'Collectée'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                      : order.statut_livraison === 'En cours'
                                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                      : order.statut_livraison === 'Annulée'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                    }
                                  `}
                                >
                                  {order.statut_livraison || 'En attente'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Formulaire de création (à droite si activé) */}
          {showNewOrderForm && !selectedOrderData && (
            <div className="w-full lg:w-1/2 transition-all duration-300">
              <NouvelleCommandeInline
                onSuccess={handleOrderCreated}
                onCancel={() => setShowNewOrderForm(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal des détails de la commande */}
      <AnimatePresence>
        {selectedOrderData && !showNewOrderForm && (
          <motion.div
            key="order-details-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseDetails();
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Bouton de fermeture */}
              <button
                onClick={handleCloseDetails}
                className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 z-10"
              >
                <CircleX className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>

              {loadingDetails ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center text-gray-500 dark:text-gray-400">
                  Chargement des détails...
                </div>
              ) : (
                <OrderDetails
  order={selectedOrderData}
  onUpdate={fetchOrders}  // ← rafraîchit la liste après action
/>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ============================================================
// Composant Formulaire intégré (avec support du mode sombre)
// ============================================================
function NouvelleCommandeInline({ onSuccess, onCancel }) {
  // ... (inchangé, même code que précédemment)
  // (je conserve le code du formulaire, il est identique à l'original)
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [formData, setFormData] = useState({
    client: { nom: '', prenom: '', telephone: '', email: '' },
    commande: {
      adresse_collecte: '',
      adresse_livraison: '',
      date_livraison_souhaitee: '',
      mode_paiement: 'Espèces',
      notes: '',
    },
  });

  const SERVICES_LIST = [
    { id: 1, nom: 'Nettoyage à sec', prixBase: 5000 },
    { id: 2, nom: 'Blanchisserie', prixBase: 3000 },
    { id: 3, nom: 'Repassage', prixBase: 2000 },
    { id: 4, nom: 'Retouche & Couture', prixBase: 4000 },
    { id: 5, nom: 'Teinture', prixBase: 6000 },
    { id: 6, nom: 'Nettoyage tapis', prixBase: 15000 },
  ];

  const MODE_PAIEMENT = ['Espèces', 'Carte', 'Mobile Money', 'Virement'];
  const montantTotal = selectedServices.reduce((total, s) => total + s.prixBase, 0);

  const addService = (service) => {
    if (!selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const removeService = (serviceId) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== serviceId));
  };

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      toast.error('Veuillez sélectionner au moins un service');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/commandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client: formData.client,
          services: selectedServices.map((s) => ({
            id: s.id,
            nom: s.nom,
            prix: s.prixBase,
          })),
          ...formData.commande,
          montant_total: montantTotal,
        }),
      });

      if (response.ok) {
        toast.success('Commande créée avec succès');
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 w-full max-h-[80vh] overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Nouvelle commande</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm">Client</h3>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Nom"
              required
              className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm"
              value={formData.client.nom}
              onChange={(e) => handleChange('client', 'nom', e.target.value)}
            />
            <input
              type="text"
              placeholder="Prénom"
              required
              className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm"
              value={formData.client.prenom}
              onChange={(e) => handleChange('client', 'prenom', e.target.value)}
            />
            <input
              type="tel"
              placeholder="Téléphone"
              required
              className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm"
              value={formData.client.telephone}
              onChange={(e) => handleChange('client', 'telephone', e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm"
              value={formData.client.email}
              onChange={(e) => handleChange('client', 'email', e.target.value)}
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm">Services</h3>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {SERVICES_LIST.map((service) => {
              const isSelected = selectedServices.some((s) => s.id === service.id);
              return (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => (isSelected ? removeService(service.id) : addService(service))}
                  className={`p-2 rounded border text-left text-xs transition ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 dark:text-gray-300'
                  }`}
                >
                  <span className="font-medium">{service.nom}</span>
                  <span className="block text-gray-500 dark:text-gray-400">
                    {service.prixBase.toLocaleString()} FC
                  </span>
                </button>
              );
            })}
          </div>
          {selectedServices.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 text-sm">
              {selectedServices.map((s) => (
                <div key={s.id} className="flex justify-between py-1">
                  <span className="text-gray-700 dark:text-gray-300">{s.nom}</span>
                  <button
                    type="button"
                    onClick={() => removeService(s.id)}
                    className="text-red-500 dark:text-red-400 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="font-bold flex justify-between pt-1 border-t border-gray-200 dark:border-gray-700 mt-1 text-gray-800 dark:text-white">
                <span>Total</span>
                <span>{montantTotal.toLocaleString()} FC</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm">Livraison</h3>
          <textarea
            rows={2}
            placeholder="Adresse de collecte"
            required
            className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm mb-2"
            value={formData.commande.adresse_collecte}
            onChange={(e) => handleChange('commande', 'adresse_collecte', e.target.value)}
          />
          <textarea
            rows={2}
            placeholder="Adresse de livraison"
            required
            className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm mb-2"
            value={formData.commande.adresse_livraison}
            onChange={(e) => handleChange('commande', 'adresse_livraison', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              required
              className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm"
              value={formData.commande.date_livraison_souhaitee}
              onChange={(e) => handleChange('commande', 'date_livraison_souhaitee', e.target.value)}
            />
            <select
              className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm"
              value={formData.commande.mode_paiement}
              onChange={(e) => handleChange('commande', 'mode_paiement', e.target.value)}
            >
              {MODE_PAIEMENT.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <textarea
            rows={2}
            placeholder="Notes"
            className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-sm mt-2"
            value={formData.commande.notes}
            onChange={(e) => handleChange('commande', 'notes', e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || selectedServices.length === 0}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}