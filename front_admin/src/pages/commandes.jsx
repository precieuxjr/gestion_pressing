import { useState, useEffect, useCallback } from 'react';

import OrderDetails from '../components/OrderDetails';
import { commandesService } from '../services/commandes';
import { motion } from 'framer-motion';
import { ReceiptText, Package, CircleX } from 'lucide-react';
import { data } from 'react-router-dom';
import NavBarHorizontal from '../components/navbar_horizontal';

export default function Commandes() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderData, setSelectedOrderData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Tous');

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

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Charger les détails d'une commande au clic
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
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const client = (order.client || '').toLowerCase();
    const id = (order.id || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchSearch = client.includes(term) || id.includes(term);
    const matchStatus = statusFilter === 'Tous' || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCloseDetails = () => setSelectedOrderData(null);
  const handleOrderCreated = () => {
    setShowNewOrderForm(false);
    fetchOrders();
  };

  const [statis, setStats] = useState({
    total: 0,
    payees: 0,
    annulees: 0,
    livrees: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await commandesService.getStats();
      setStats(data);
    };
    fetchStats();
  }, []);
  const updateStatus = async (orderId, newStatus) => {
    try { console.log('📤 Envoi de la mise à jour :', { status: newStatus });
    await commandesService.updateStatus(orderId, newStatus);

      await fetchOrders(); // rafraîchit la liste
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  const stats = [
    {
      id: 1,
      nom: 'Nombre des commandes',
      icon: ReceiptText,
      result: orders.length,
      style:
        'relative w-55 overflow-hidden rounded-xl bg²-linear-to-br from-white to-blue-50 p-4 shadow-sm border border-blue-100',
    },
    {
      id: 2,
      nom: 'Commandes Payées ',
      icon: ReceiptText,
      result: statis.payees,
      style:
        'relative w-55 overflow-hidden rounded-xl bg-green-200 p-4   shadow-sm border border-blue-100',
    },
    {
      id: 3,
      nom: 'Commandes annulées',
      icon: CircleX,
      result: statis.annulees,
      style:
        'relative w-55 overflow-hidden rounded-xl bg-red-200 p-4 shadow-sm border  border-blue-100',
    },
    {
      id: 4,
      nom: 'Commandes à livrer',
      icon: Package,
      result: statis.livrees,
      style:
        'relative w-55 overflow-hidden rounded-xl bg-red-200 p-4 shadow-sm border border-blue-100',
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

  const handleSearch = (term) => {
    setSearchTerm(term);
  };


  const handleExportCSV = () => {
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
    link.download = `commandes_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="flex flex-col bg-gray-50 min-h-screen w-250">
      <NavBarHorizontal
        buttonLabel="Nouvelle commande"
        onButtonClick={() => console.log('Ajouter une commande')}
        onSearch={handleSearch}
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-4 gap-4 justify-items-center my-3.5 bg-white py-6"
      >
        {stats.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={item.style}
          >
            <div className="flex justify-between items-start">
              <item.icon className={'w-6 h-6 text-blue-'} />
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                Unité
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-800">
              {item.result}
            </p>
            <p className="text-sm text-gray-500">{item.nom}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des commandes</h1>

        <div className="flex gap-6">
          {/* Colonne gauche - Liste des commandes */}
          <div
            className={`${
              showNewOrderForm || selectedOrderData ? 'w-1/2' : 'w-full'
            } transition-all duration-300`}
          >
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Toutes les commandes</h2>
                <div className="flex gap-2 items-center">
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="text-xs border rounded px-2 py-1 bg-white"
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
      className="text-xs text-blue-500 hover:text-blue-700"
    >
      Réinitialiser
    </button>
  )}
  <button
      onClick={handleExportCSV}
      className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
    >
      Exporter
    </button>
</div>
              </div>
              <div className="overflow-x-auto">
                {loading && (
                  <div className="text-center py-4">
                    Chargement des commandes...
                  </div>
                )}
                {error && (
                  <div className="text-red-600 text-center py-4">{error}</div>
                )}
                {!loading && !error && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Réf.
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Tél.
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Dépôt
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Prévue
                        </th>
                        <th className="ppx-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          onClick={() => handleOrderClick(order.id)}
                          className={`hover:bg-gray-50 transition-colors duration-150 ${
                            selectedOrderData?.id === order.id &&
                            !showNewOrderForm
                              ? 'bg-blue-50'
                              : ''
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {order.reference || order.id?.substring(0, 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {order.client || '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {order.phone || '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {order.depositDate
                              ? new Date(order.depositDate).toLocaleDateString(
                                  'fr-FR'
                                )
                              : '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {order.expectedDate
                              ? new Date(order.expectedDate).toLocaleDateString(
                                  'fr-FR'
                                )
                              : '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {order.amount
                              ? `${order.amount.toLocaleString()} FC`
                              : '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
  <select
    value={order.status}
    onChange={(e) => updateStatus(order.id, e.target.value)}
    onClick={(e) => e.stopPropagation()}  // ← AJOUTEZ CETTE LIGNE
    className={`text-xs px-2 py-1 rounded-full border ${
      order.status === 'Retirer' ? 'bg-blue-100 text-blue-800' :
      order.status === 'Payée' ? 'bg-blue-100 text-green-800' :
      order.status === 'Annulée' ? 'bg-red-100 text-red-800' :
      order.status === 'Prêt' ? 'bg-purple-100 text-orange-800' :
      'bg-yellow-100 text-yellow-800'
    }`}
  >
    
    <option value="Payée">Payée</option>
    <option value="Annulée">Annulée</option>
    <option value="Retirer">Retirer</option>
    <option value="Prêt">Prêt</option>
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

          {/* Colonne droite - Formulaire de nouvelle commande */}
          {showNewOrderForm && (
            <div className="w-1/2 transition-all duration-300 relative">
              <button
                onClick={() => setShowNewOrderForm(false)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-10"
              >
                <CircleX className="w-5 h-5 text-gray-500" />
              </button>
              <NouvelleCommandeInline
                onSuccess={handleOrderCreated}
                onCancel={() => setShowNewOrderForm(false)}
              />
            </div>
          )}

          {/* Colonne droite - Détails de la commande */}
          {selectedOrderData && !showNewOrderForm && (
            <div className="w-1/2 transition-all duration-300 relative">
              <button
                onClick={handleCloseDetails}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-10"
              >
                <CircleX className="w-5 h-5 text-gray-500" />
              </button>
              {loadingDetails ? (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                  Chargement des détails...
                </div>
              ) : (
                <OrderDetails order={selectedOrderData} />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Composant Formulaire intégré (à conserver tel quel)
function NouvelleCommandeInline({ onSuccess, onCancel }) {
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
  const montantTotal = selectedServices.reduce(
    (total, s) => total + s.prixBase,
    0
  );

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
      alert('Veuillez sélectionner au moins un service');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        'http://localhost:5000/api/admin/commandes',
        {
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
        }
      );

      if (response.ok) {
        alert('Commande créée avec succès !');
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 w-100 h-120 overflow-y-auto ">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Nouvelle commande
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2 text-sm">Client</h3>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Nom"
              required
              className="px-2 py-1.5 border rounded text-sm"
              value={formData.client.nom}
              onChange={(e) => handleChange('client', 'nom', e.target.value)}
            />
            <input
              type="text"
              placeholder="Prénom"
              required
              className="px-2 py-1.5 border rounded text-sm"
              value={formData.client.prenom}
              onChange={(e) => handleChange('client', 'prenom', e.target.value)}
            />
            <input
              type="tel"
              placeholder="Téléphone"
              required
              className="px-2 py-1.5 border rounded text-sm"
              value={formData.client.telephone}
              onChange={(e) =>
                handleChange('client', 'telephone', e.target.value)
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="px-2 py-1.5 border rounded text-sm"
              value={formData.client.email}
              onChange={(e) => handleChange('client', 'email', e.target.value)}
            />
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2 text-sm">Services</h3>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {SERVICES_LIST.map((service) => {
              const isSelected = selectedServices.some(
                (s) => s.id === service.id
              );
              return (
                <button
                  type="button"
                  key={service.id}
                  onClick={() =>
                    isSelected ? removeService(service.id) : addService(service)
                  }
                  className={`p-2 rounded border text-left text-xs transition ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="font-medium">{service.nom}</span>
                  <span className="block text-gray-500">
                    {service.prixBase.toLocaleString()} FC
                  </span>
                </button>
              );
            })}
          </div>
          {selectedServices.length > 0 && (
            <div className="border-t pt-2 text-sm">
              {selectedServices.map((s) => (
                <div key={s.id} className="flex justify-between py-1">
                  <span>{s.nom}</span>
                  <button
                    type="button"
                    onClick={() => removeService(s.id)}
                    className="text-red-500 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="font-bold flex justify-between pt-1 border-t mt-1">
                <span>Total</span>
                <span>{montantTotal.toLocaleString()} FC</span>
              </div>
            </div>
          )}
        </div>

        {/* Livraison */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2 text-sm">
            Livraison
          </h3>
          <textarea
            rows={2}
            placeholder="Adresse de collecte"
            required
            className="w-full px-2 py-1.5 border rounded text-sm mb-2"
            value={formData.commande.adresse_collecte}
            onChange={(e) =>
              handleChange('commande', 'adresse_collecte', e.target.value)
            }
          />
          <textarea
            rows={2}
            placeholder="Adresse de livraison"
            required
            className="w-full px-2 py-1.5 border rounded text-sm mb-2"
            value={formData.commande.adresse_livraison}
            onChange={(e) =>
              handleChange('commande', 'adresse_livraison', e.target.value)
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              required
              className="px-2 py-1.5 border rounded text-sm"
              value={formData.commande.date_livraison_souhaitee}
              onChange={(e) =>
                handleChange(
                  'commande',
                  'date_livraison_souhaitee',
                  e.target.value
                )
              }
            />
            <select
              className="px-2 py-1.5 border rounded text-sm"
              value={formData.commande.mode_paiement}
              onChange={(e) =>
                handleChange('commande', 'mode_paiement', e.target.value)
              }
            >
              {MODE_PAIEMENT.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <textarea
            rows={2}
            placeholder="Notes"
            className="w-full px-2 py-1.5 border rounded text-sm mt-2"
            value={formData.commande.notes}
            onChange={(e) => handleChange('commande', 'notes', e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || selectedServices.length === 0}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}
