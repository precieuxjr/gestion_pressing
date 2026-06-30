import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Edit2, Trash2, MoreHorizontal, User, Mail, Phone, MapPin, 
  Loader2, CheckCircle2, Trash, Eye, EyeOff, Lock,
  UserRound, UserRoundCog 
} from 'lucide-react';
import { clientsService } from '../services/sevice_client';
import NavBarHorizontal from '../components/navbar_horizontal';

export default function Clients() {
  // États
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
    password: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Notification toast
  const triggerNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Récupérer les clients
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
  }, [fetchClients]);

  // Gestion du formulaire
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
        password: '' // Ne pas pré-remplir le mot de passe
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
        password: ''
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
        // Mise à jour : on n'envoie PAS le mot de passe
        const { password, ...updateData } = formData;
        await clientsService.update(editingClient.public_id, updateData); // ← public_id
        triggerNotification('Client mis à jour avec succès', 'success');
      } else {
        // Création : on envoie tout, y compris le mot de passe
        await clientsService.create(formData);
        triggerNotification('Client ajouté avec succès', 'success');
      }
      await fetchClients();
      handleCloseForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Filtrage
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

  const handleSearch = (term) => setSearchTerm(term);

  // Suppression (avec public_id)
  const handleDelete = async (publicId) => {
    try {
      await clientsService.delete(publicId);
      await fetchClients();
      setDeleteConfirm(null);
      triggerNotification('Client supprimé avec succès', 'delete');
    } catch (err) {
      alert(err.message);
    }
  };

  const getInitials = (client) => {
    const first = client.prenom ? client.prenom.charAt(0).toUpperCase() : '';
    const last = client.nom ? client.nom.charAt(0).toUpperCase() : '';
    return first + last;
  };

  // Variants d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } },
  };

  const tableRowVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: (i) => ({ x: 0, opacity: 1, transition: { delay: i * 0.03, duration: 0.2 } }),
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
  };

  // Statistiques
  const stats = [
    {
      id: 1,
      nom: 'Nombre de clients',
      icon: UserRound,
      result: clients.length,
      style: "relative w-65 overflow-hidden rounded-xl bg-gradient-to-br from-white to-blue-50 p-4 shadow-sm border border-blue-100",
    },
    {
      id: 2,
      nom: 'Comptes actifs',
      icon: UserRoundCog,
      result: clients.filter(c => c.statut === 'actif').length,
      style: "relative w-65 overflow-hidden rounded-xl bg-green-200 p-4 shadow-sm border border-blue-100",
    },
    {
      id: 3,
      nom: 'Comptes suspendus',
      icon: UserRoundCog,
      result: clients.filter(c => c.statut === 'suspendu').length,
      style: "relative w-65 overflow-hidden rounded-xl bg-red-200 p-4 shadow-sm border border-red-100",
    },
  ];

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col bg-gray-50 min-h-screen w-full"
    >
      <NavBarHorizontal
        buttonLabel="Nouveau client"
        onButtonClick={() => handleOpenForm()}
        onSearch={handleSearch}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center my-3.5 bg-white py-6 px-4"
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
                      {/* Colonnes... (inchangées) */}
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
                              <span className={`w-2 h-2 rounded-full ${client.statut === 'actif' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              <span className="font-medium">{client.statut === 'actif' ? 'Actif' : 'Suspendu'}</span>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2 relative">
                          {/* Modifier */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOpenForm(client)}
                            className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>

                          {/* Supprimer */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDeleteConfirm(client.public_id)} 
                            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Modal formulaire – inchangé mais corrigé pour le scroll */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="client-form-modal"
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
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-gradient-to-br from-blue-500 to-sky-400 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {editingClient ? 'Modifier le client' : 'Nouveau client'}
                    </h2>
                    <p className="text-blue-100 text-sm mt-0.5">
                      {editingClient ? 'Mettez à jour les informations' : 'Ajoutez un nouveau client à votre base'}
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

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* ... tous les champs ... (inchangés) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                      <User className="w-4 h-4 text-blue-500" />
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      required
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Tshisekedi"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-gray-50/50 hover:bg-white focus:bg-white text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                      <User className="w-4 h-4 text-blue-500" />
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      required
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder="Felix"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-gray-50/50 hover:bg-white focus:bg-white text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <User className="w-4 h-4 text-blue-500" />
                    Postnom
                  </label>
                  <input
                    type="text"
                    name="postnom"
                    value={formData.postnom}
                    onChange={handleChange}
                    placeholder="Lema"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-gray-50/50 hover:bg-white focus:bg-white text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <Mail className="w-4 h-4 text-blue-500" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tresor@email.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-gray-50/50 hover:bg-white focus:bg-white text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <Phone className="w-4 h-4 text-blue-500" />
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    required
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="+243 812 345 678"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-gray-50/50 hover:bg-white focus:bg-white text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    Adresse
                  </label>
                  <textarea
                    name="adresse"
                    rows="2"
                    value={formData.adresse}
                    onChange={handleChange}
                    placeholder="Rue, quartier, ville"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-gray-50/50 hover:bg-white focus:bg-white text-gray-800 placeholder:text-gray-400 resize-none"
                  />
                </div>

                {/* Champ mot de passe (uniquement en création) */}
                {!editingClient && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                      <Lock className="w-4 h-4 text-blue-500" />
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-gray-50/50 hover:bg-white focus:bg-white text-gray-800 placeholder:text-gray-400 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-br from-blue-500 to-sky-400 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingClient ? 'Mettre à jour' : 'Ajouter le client'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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