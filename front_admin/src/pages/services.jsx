import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, CheckCircle2, Trash } from 'lucide-react';
import NotificationIcon from '../components/notifiocations';
import { servicesService } from '../services/services';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    description: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const triggerNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await servicesService.getAll();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await servicesService.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    fetchStats();
  }, [fetchServices, fetchStats]);

  const handleAddClick = () => {
    setEditingService(null);
    setFormData({ nom: '', prix: '', description: '' });
    setShowForm(true);
  };

  const handleEditClick = (service) => {
    setEditingService(service);
    setFormData({
      nom: service.nom,
      prix: service.prix,
      description: service.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (publicId, nom) => {
    if (!confirm(`Supprimer le service "${nom}" ?`)) return;
    try {
      await servicesService.delete(publicId);
      await fetchServices();
      await fetchStats();
      triggerNotification(`Le service "${nom}" a été supprimé avec succès.`, 'delete');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const dataToSend = {
        nom: formData.nom,
        prix: formData.prix ? parseFloat(formData.prix) : 0,
        description: formData.description || null
      };
      console.log('📦 Envoi :', dataToSend);
      if (editingService) {
        await servicesService.update(editingService.public_id, dataToSend);
        triggerNotification('Le service a été mis à jour avec succès.', 'success');
      } else {
        await servicesService.create(dataToSend);
        triggerNotification('Le service a été ajouté avec succès.', 'success');
      }
      setShowForm(false);
      await fetchServices();
      await fetchStats();
    } catch (err) {
      alert(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  const tableRowVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: (i) => ({ x: 0, opacity: 1, transition: { delay: i * 0.03, duration: 0.2 } })
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col bg-gray-50 min-h-screen w-250 relative"
    >
      <motion.header
        variants={itemVariants}
        className="bg-white w-full h-14 flex items-center justify-between px-4 gap-3 sticky top-0 z-10 shadow-sm"
      >
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 w-80 md:w-96 h-10 px-3">
          <span className="text-gray-400 text-sm">Gestion des services</span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationIcon />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Nouveau service
          </motion.button>
        </div>
      </motion.header>

      <div className="p-6">
        <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-6">
          Services du pressing
        </motion.h1>

        {stats && Array.isArray(stats) && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
          >
            <motion.div variants={cardVariants} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-blue-50 p-4 shadow-sm border border-blue-100">
              <p className="text-sm text-gray-500">Total services</p>
              <p className="text-2xl font-bold">{services.length}</p>
            </motion.div>
            <motion.div variants={cardVariants} className="relative overflow-hidden rounded-xl bg-green-100 p-4 shadow-sm border border-green-200">
              <p className="text-sm text-gray-500">Commandes associées</p>
              <p className="text-2xl font-bold">
                {stats.reduce((sum, item) => sum + (Number(item.total_commandes) || 0), 0).toLocaleString()}
              </p>
            </motion.div>
            <motion.div variants={cardVariants} className="relative overflow-hidden rounded-xl bg-red-100 p-4 shadow-sm border border-red-200">
              <p className="text-sm text-gray-500">Chiffre d'affaires</p>
              <p className="text-2xl font-bold">
                {stats.reduce((sum, item) => sum + (Number(item.chiffre_affaires) || 0), 0).toLocaleString()} FC
              </p>
            </motion.div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {loading && <div className="text-center py-4">Chargement...</div>}
            {error && <div className="text-red-600 text-center py-4">{error}</div>}
            {!loading && !error && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Prix (FCFA)</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {services.map((service, idx) => (
                    <motion.tr
                      key={service.id}
                      custom={idx}
                      initial="hidden"
                      animate="visible"
                      variants={tableRowVariants}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{service.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{parseInt(service.prix).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{service.description || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditClick(service)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <Pencil className="w-4 h-4 inline" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(service.public_id, service.nom)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                  {services.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-500">
                        Aucun service. Cliquez sur "Nouveau service" pour en ajouter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
      {showForm && (
  <motion.div
    key="modal"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={(e) => {
      if (e.target === e.currentTarget) setShowForm(false);
    }}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 20, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
    >
      {/* En-tête avec dégradé */}
      <div className="bg-linear-to-br from-blue-500 to-sky-400 px-6 py-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {editingService ? 'Modifier le service' : 'Nouveau service'}
            </h2>
            <p className="text-blue-100 text-sm mt-0.5">
              {editingService ? 'Mettez à jour les informations' : 'Ajoutez un nouveau service à votre catalogue'}
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
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Champ Nom */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">8
            Nom du service *
          </label>
          <input
            type="text"
            name="nom"
            required
            value={formData.nom}
            onChange={handleChange}
            placeholder="Ex: Nettoyage à sec"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-gray-50/50 hover:bg-white focus:bg-white text-gray-800 placeholder:text-gray-400"
          />
        </div>

        {/* Champ Prix */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">

            Prix (FCFA) *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">FC</span>
            <input
              type="number"
              name="prix"
              required
              min="0"
              step="100"
              value={formData.prix}
              onChange={handleChange}
              placeholder="5 000"
              className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-gray-50/50 hover:bg-white focus:bg-white text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Champ Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
       
            Description
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez le service en quelques mots..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-gray-50/50 hover:bg-white focus:bg-white text-gray-800 placeholder:text-gray-400 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="flex-1 px-4 py-2.5 border border-gray-200  rounded-xl text-gray-600 font-medium hover:bg-red-300 transition-colors"
          >
            Annuler
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={formLoading}
            className="flex-1 px-4 py-2.5 bg-linear-to-br from-blue-500 to-sky-400 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editingService ? 'Mettre à jour' : 'Créer le service'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  </motion.div>
)}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-5 right-5 z-50"
          >
            <div className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border text-sm font-medium max-w-sm bg-white transition-all duration-300 ${
              notification.type === 'success' 
                ? 'border-l-4 border-l-green-500 text-gray-800' 
                : 'border-l-4 border-l-red-500 text-gray-800'
            }`}>
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
              <button onClick={() => setNotification(null)} className="ml-auto text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}