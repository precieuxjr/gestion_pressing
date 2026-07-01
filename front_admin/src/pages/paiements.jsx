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
  AlertTriangle,
} from 'lucide-react';
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
  const [deleteTarget, setDeleteTarget] = useState(null);
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
      const paiementsData = data?.data || data || [];
      setPaiements(Array.isArray(paiementsData) ? paiementsData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await paiementsService.getStats();
      setStats(response?.data || null);
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

  const handleDeleteClick = (publicId) => {
    setDeleteTarget(publicId);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await paiementsService.delete(deleteTarget);
      await fetchPaiements();
      await fetchStats();
      triggerNotification('Paiement supprimé avec succès', 'delete');
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
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
    hidden: { scale: 0.9, y: 20, opacity: 0 },
    visible: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 25, stiffness: 300 },
    },
    exit: { scale: 0.9, y: 20, opacity: 0, transition: { duration: 0.2 } },
  };

  const confirmModalVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2 } },
  };

  const statsCards = stats
    ? [
        {
          id: 1,
          nom: 'Total paiements',
          valeur: stats.total_paiements || 0,
          color: 'from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20',
          border: 'border-blue-100 dark:border-blue-800',
        },
        {
          id: 2,
          nom: 'Montant total (FC)',
          valeur: (stats.montant_total || 0).toLocaleString(),
          color: 'from-white to-green-50 dark:from-gray-800 dark:to-green-900/20',
          border: 'border-green-100 dark:border-green-800',
        },
        {
          id: 3,
          nom: 'Montant validé (FC)',
          valeur: (stats.montant_valide || 0).toLocaleString(),
          color: 'from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-900/20',
          border: 'border-emerald-100 dark:border-emerald-800',
        },
        {
          id: 4,
          nom: 'Montant remboursé (FC)',
          valeur: (stats.montant_rembourse || 0).toLocaleString(),
          color: 'from-white to-red-50 dark:from-gray-800 dark:to-red-900/20',
          border: 'border-red-100 dark:border-red-800',
        },
      ]
    : [];

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col bg-gray-50 dark:bg-gray-900 min-h-screen w-full"
    >
      <NavBarHorizontal
        buttonLabel="Nouveau paiement"
        onButtonClick={handleAddClick}
        onSearch={handleSearch}
        placeholder="Rechercher (réf., commande, mode)..."
      />

      <div className="p-4 md:p-6">
        <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
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
                className={`relative overflow-hidden rounded-xl bg-linear-to-br ${card.color} p-4 shadow-sm border ${card.border}`}
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.nom}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{card.valeur}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-hidden">
          {loading && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Chargement des paiements...
            </div>
          )}
          {error && (
            <div className="text-red-600 dark:text-red-400 text-center py-8">{error}</div>
          )}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Référence
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="relative px-4 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredPaiements.map((p, idx) => (
                    <motion.tr
                      key={p.public_id}
                      custom={idx}
                      initial="hidden"
                      animate="visible"
                      variants={tableRowVariants}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {p.commande_reference || p.reference}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {p.client_nom || p.commande_id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {p.montant.toLocaleString()} FCFA
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {p.mode_paiement}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={p.statut}
                          onChange={(e) =>
                            handleUpdateStatut(p.public_id, e.target.value)
                          }
                          className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                            p.statut === 'Validé'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
                              : p.statut === 'Remboursé'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700'
                          }`}
                        >
                          <option value="En attente">En attente</option>
                          <option value="Validé">Validé</option>
                          <option value="Échoué">Échoué</option>
                          <option value="Remboursé">Remboursé</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {p.date_paiement
                          ? new Date(p.date_paiement).toLocaleDateString('fr-FR')
                          : '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Modifier la note"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(p.public_id)}
                            className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
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
                      <td colSpan="7" className="text-center py-12 text-gray-500 dark:text-gray-400">
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

      {/* Modal Formulaire moderne */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="paiement-form-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowForm(false);
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* En-tête avec dégradé */}
              <div className="bg-gradient-to-br from-blue-500 to-sky-400 dark:from-blue-600 dark:to-sky-500 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {editingPaiement
                        ? 'Modifier la note du paiement'
                        : 'Nouveau paiement'}
                    </h2>
                    <p className="text-blue-100 text-sm mt-0.5">
                      {editingPaiement
                        ? 'Mettez à jour les informations'
                        : 'Ajoutez un nouveau paiement'}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowForm(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Contenu du formulaire */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {!editingPaiement ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ID de la commande *
                      </label>
                      <input
                        type="number"
                        name="commande_id"
                        required
                        value={formData.commande_id}
                        onChange={handleChange}
                        placeholder="Ex: 123"
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-gray-50/50 hover:bg-white focus:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Montant (FC) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-semibold">FC</span>
                        <input
                          type="number"
                          name="montant"
                          required
                          min="0"
                          step="100"
                          value={formData.montant}
                          onChange={handleChange}
                          placeholder="5 000"
                          className="w-full pl-12 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-gray-50/50 hover:bg-white focus:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mode de paiement *
                      </label>
                      <select
                        name="mode_paiement"
                        value={formData.mode_paiement}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-gray-50/50 hover:bg-white focus:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 text-gray-800 dark:text-white"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Note
                    </label>
                    <textarea
                      name="note"
                      rows="3"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="Informations supplémentaires..."
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-gray-50/50 hover:bg-white focus:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 text-gray-800 dark:text-white resize-none"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Annuler
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-br from-blue-500 to-sky-400 dark:from-blue-600 dark:to-sky-500 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingPaiement ? 'Mettre à jour' : 'Ajouter le paiement'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal confirmation suppression moderne */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            key="delete-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) cancelDelete();
            }}
          >
            <motion.div
              variants={confirmModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white">
                  Confirmer la suppression
                </h3>
                <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
                  Êtes-vous sûr de vouloir supprimer ce paiement ?<br />
                  Cette action est irréversible.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </motion.button>
                </div>
              </div>
            </motion.div>
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
            transition={{ duration: 0.3 }}
            className="fixed bottom-5 right-5 z-50"
          >
            <div
              className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border text-sm font-medium max-w-sm bg-white dark:bg-gray-800 ${
                notification.type === 'success'
                  ? 'border-l-4 border-l-green-500'
                  : 'border-l-4 border-l-red-500'
              }`}
            >
              {notification.type === 'success' ? (
                <div className="p-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                  <Trash className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {notification.type === 'success' ? 'Succès !' : 'Supprimé !'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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