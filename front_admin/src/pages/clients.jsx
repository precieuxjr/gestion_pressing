import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import NotificationIcon from '../components/notifiocations';
import { clientsService } from '../services/sevice_client';
import { UserRound, UserRoundCog } from 'lucide-react';
import NavBarHorizontal from '../components/navbar_horizontal';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [filteredClients, setFilteredClients] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    postnom: '',
    email: '',
    telephone: '',
    adresse: '',
    role: 'client',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);


  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientsService.getAll();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
    // ✅ Plus d'écoute WebSocket
  }, [fetchClients]);


  const handleOpenForm = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        nom: client.nom || '',
        prenom: client.prenom || '',
        postnom: client.postnom || '',
        email: client.email || '',
        telephone: client.telephone || '',
        adresse: client.adresse || '',
        role: client.role || 'client',
      });
    } else {
      setEditingClient(null);
      setFormData({
        nom: '',
        prenom: '',
        postnom: '',
        email: '',
        telephone: '',
        adresse: '',
        role: 'client',
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingClient) {
        await clientsService.update(editingClient.id, formData);
      } else {
        await clientsService.create(formData);
      }
      await fetchClients();
      handleCloseForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telephone?.includes(searchTerm)
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleDelete = async (id) => {
    try {
      await clientsService.delete(id);
      await fetchClients();
      setDeleteConfirm(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const getInitials = (client) => {
    const first = client.prenom ? client.prenom.charAt(0).toUpperCase() : '';
    const last = client.nom ? client.nom.charAt(0).toUpperCase() : '';
    return first + last;
  };

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

  const tableRowVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: (i) => ({ x: 0, opacity: 1, transition: { delay: i * 0.03, duration: 0.2 } }),
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
  };

  const stats = [
    { id: 1, nom: 'Nombre de client', icon: UserRound, result: clients.length, style: "relative w-65 overflow-hidden rounded-xl bg-linear-to-br from-white to-blue-50 p-4 shadow-sm border border-blue-100" },
    { id: 2, nom: 'Compte client actif ', icon: UserRoundCog, result: clients.filter(client => client.statut == 'actif').length, style: "relative w-65 overflow-hidden rounded-xl bg-green-200 p-4" },
    { id: 3, nom: 'Compte client suspendu', icon: UserRoundCog, result: clients.filter(client => client.statut == 'suspendu').length, style: "relative w-65 overflow-hidden rounded-xl bg-red-200 p-4 shadow-sm border border-red-100" },
  ];

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col bg-gray-50 min-h-screen w-250"
    >
      <NavBarHorizontal
        buttonLabel="Nouveau client"
        onButtonClick={() => console.log('Ajouter client')}
        onSearch={handleSearch}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-4 justify-items-center my-3.5 bg-white py-6"
      >
        {stats.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={item.style}
          >
            <div className="flex justify-between items-start">
              <item.icon className="w-6 h-6 text-blue-500" />
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                Unité
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-800">
              {item.result || '0'}
            </p>
            <p className="text-sm text-gray-500">{item.nom}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="p-6">
        <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-6">
          Gestion des clients
        </motion.h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-hidden">
          {loading && <div className="text-center py-8 text-gray-500">Chargement des clients...</div>}
          {error && <div className="text-red-600 text-center py-8">{error}</div>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PATIENT</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">CONTACT</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">EMAIL</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ADRESSE</th>
                    <th className="relative px-4 py-4"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredClients.map((client, idx) => (
                    <motion.tr
                      key={client.id}
                      custom={idx}
                      initial="hidden"
                      animate="visible"
                      variants={tableRowVariants}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-9 w-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-medium text-sm">
                            {getInitials(client) || '?'}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {client.prenom} {client.nom} {client.postnom}
                            </div>
                          </div>
                        </div>
                       </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-mono">{client.telephone || '—'}</div>
                       </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{client.email || '—'}</div>
                       </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col space-y-1.5">
                          <span className="text-sm text-gray-700 truncate max-w-xs">{client.adresse || '—'}</span>
                          <div className="flex items-center">
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              <span className="text-green-600 text-sm">✓</span>
                              <span className="font-medium">{client.statut === 'actif' ? 'Actif' : 'suspendu'}</span>
                            </span>
                          </div>
                        </div>
                       </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOpenForm(client)}
                            className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDeleteConfirm(client.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </motion.button>
                        </div>
                       </td>
                    </motion.tr>
                  ))}
                  {filteredClients.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-gray-500">Aucun client trouvé</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal formulaire avec animation */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="client-form-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold">{editingClient ? 'Modifier le client' : 'Nouveau client'}</h2>
                <button onClick={handleCloseForm} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* ... champs du formulaire inchangés ... */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postnom</label>
                  <input type="text" name="postnom" value={formData.postnom} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <textarea name="adresse" rows="2" value={formData.adresse} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={handleCloseForm} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
                  <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {formLoading ? 'Enregistrement...' : (editingClient ? 'Modifier' : 'Créer')}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal confirmation suppression avec animation */}
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
              <h3 className="text-lg font-bold mb-4">Confirmer la suppression</h3>
              <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Supprimer</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}