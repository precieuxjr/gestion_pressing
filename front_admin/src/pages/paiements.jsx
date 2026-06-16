import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  Trash,
} from 'lucide-react';
import NotificationIcon from '../components/notifiocations';
import { paiementsService } from '../services/paiements';
import NavBarHorizontal from '../components/navbar_horizontal';

export default function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPaiement, setEditingPaiement] = useState(null);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    commande_id: '',
    montant: '',
    mode_paiement: 'Espèces',
    note: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  const triggerNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchPaiements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paiementsService.getAll();
      setPaiements(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await paiementsService.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchPaiements();
    fetchStats();
  }, [fetchPaiements, fetchStats]);

  const filteredPaiements = paiements.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.reference?.toLowerCase().includes(term) ||
      p.commande_id?.toString().includes(searchTerm) ||
      p.mode_paiement?.toLowerCase().includes(term) ||
      p.client_nom?.toLowerCase().includes(term)
    );
  });

  const handleSearch = (term) => setSearchTerm(term);

  const handleAddClick = () => {
    setEditingPaiement(null);
    setFormData({
      commande_id: '',
      montant: '',
      mode_paiement: 'Espèces',
      note: '',
    });
    setShowForm(true);
  };

  const handleEditClick = (paiement) => {
    setEditingPaiement(paiement);
    setFormData({
      commande_id: paiement.commande_id,
      montant: paiement.montant,
      mode_paiement: paiement.mode_paiement,
      note: paiement.note || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (publicId) => {
    try {
      await paiementsService.delete(publicId);
      await fetchPaiements();
      await fetchStats();
      triggerNotification('Paiement supprimé avec succès', 'delete');
      setDeleteConfirm(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const dataToSend = {
        commande_id: parseInt(formData.commande_id),
        montant: parseFloat(formData.montant),
        mode_paiement: formData.mode_paiement,
        note: formData.note || null,
      };
      await paiementsService.create(dataToSend);
      triggerNotification('Paiement enregistré avec succès', 'success');
      setShowForm(false);
      await fetchPaiements();
      await fetchStats();
    } catch (err) {
      alert(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateStatut = async (publicId, newStatut) => {
    try {
      await paiementsService.updateStatut(publicId, newStatut);
      await fetchPaiements();
      await fetchStats();
      triggerNotification(`Statut mis à jour : ${newStatut}`, 'success');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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
  const tableRowVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.03, duration: 0.2 },
    }),
  };
  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', damping: 25, stiffness: 300 },
    },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
  };

  const statsCards = stats
    ? [
        {
          id: 1,
          nom: 'Total paiements',
          valeur: stats.total_paiements || 0,
          color: 'from-white to-blue-50',
        },
        {
          id: 2,
          nom: 'Montant total (FCFA)',
          valeur: (stats.montant_total || 0).toLocaleString(),
          color: 'from-white to-green-50',
        },
        {
          id: 3,
          nom: 'Montant validé (FCFA)',
          valeur: (stats.montant_valide || 0).toLocaleString(),
          color: 'from-white to-emerald-50',
        },
        {
          id: 4,
          nom: 'Montant remboursé (FCFA)',
          valeur: (stats.montant_rembourse || 0).toLocaleString(),
          color: 'from-white to-red-50',
        },
      ]
    : [];

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col bg-gray-50 min-h-screen w-245"
    >
      <NavBarHorizontal
        buttonLabel="Nouveau paiement"
        onButtonClick={handleAddClick}
        onSearch={handleSearch}
        placeholder="Rechercher (réf., commande, mode)..."
      />

      <div className="p-6">
        <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-6">
          Gestion des paiements
        </motion.h1>

        {stats && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            {statsCards.map((card) => (
              <motion.div
                key={card.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className={`relative overflow-hidden rounded-xl bg-linear-to-br ${card.color} p-4 shadow-sm border`}
              >
                <p className="text-sm text-gray-500">{card.nom}</p>
                <p className="text-2xl font-bold">{card.valeur}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-hidden">
          {loading && (
            <div className="text-center py-8 text-gray-500">
              Chargement des paiements...
            </div>
          )}
          {error && (
            <div className="text-red-600 text-center py-8">{error}</div>
          )}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Référence
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="relative px-4 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredPaiements.map((p, idx) => (
                    <motion.tr
                      key={p.public_id}
                      custom={idx}
                      initial="hidden"
                      animate="visible"
                      variants={tableRowVariants}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
    {p.commande_reference || p.reference}
</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {p.client_nom || p.commande_id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {p.montant.toLocaleString()} FCFA
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {p.mode_paiement}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={p.statut}
                          onChange={(e) =>
                            handleUpdateStatut(p.public_id, e.target.value)
                          }
                          className={`text-xs px-2 py-1 rounded-full border ${
                            p.statut === 'Validé'
                              ? 'bg-green-100 text-green-800'
                              : p.statut === 'Remboursé'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <option value="En attente">En attente</option>
                          <option value="Validé">Validé</option>
                          <option value="Échoué">Échoué</option>
                          <option value="Remboursé">Remboursé</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(p.date_paiement).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100"
                            title="Modifier la note"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(p.public_id)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredPaiements.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-12 text-gray-500"
                      >
                        Aucun paiement trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Formulaire */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="paiement-form-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold">
                  {editingPaiement
                    ? 'Modifier la note du paiement'
                    : 'Nouveau paiement'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {!editingPaiement ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID de la commande *
                      </label>
                      <input
                        type="number"
                        name="commande_id"
                        required
                        value={formData.commande_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Montant (FCFA) *
                      </label>
                      <input
                        type="number"
                        name="montant"
                        required
                        min="0"
                        step="100"
                        value={formData.montant}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mode de paiement *
                      </label>
                      <select
                        name="mode_paiement"
                        value={formData.mode_paiement}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Espèces">Espèces</option>
                        <option value="Carte">Carte</option>
                        <option value="Mobile Money">Mobile Money</option>
                        <option value="Virement">Virement</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Note
                    </label>
                    <textarea
                      name="note"
                      rows="3"
                      value={formData.note}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {formLoading && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {editingPaiement ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal confirmation suppression */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            key="delete-confirm-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
              <h3 className="text-lg font-bold mb-4">
                Confirmer la suppression
              </h3>
              <p className="text-gray-600 mb-6">
                Cette action est irréversible. Supprimer ce paiement ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed bottom-5 right-5 z-50"
          >
            <div
              className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border text-sm font-medium max-w-sm bg-white ${
                notification.type === 'success'
                  ? 'border-l-4 border-l-green-500'
                  : 'border-l-4 border-l-red-500'
              }`}
            >
              {notification.type === 'success' ? (
                <div className="p-1.5 bg-green-50 text-green-600 rounded-full">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-1.5 bg-red-50 text-red-600 rounded-full">
                  <Trash className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="font-bold text-gray-900">
                  {notification.type === 'success' ? 'Succès !' : 'Supprimé !'}
                </p>
                <p className="text-xs text-gray-500">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
