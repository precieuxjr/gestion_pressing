import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
} from 'lucide-react';

import { livraisonService } from '../services/livraison';
import NavBarHorizontal from '../components/navbar_horizontal';

export default function Livraisons() {
  const [commandes, setCommandes] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLivreur, setSelectedLivreur] = useState({});
  const [assigning, setAssigning] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchCommandes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const data = await livraisonService.getCommandesLivraison('Prêt');
        setCommandes(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
}, []);


  const fetchLivreurs = useCallback(async () => {
    try {
      const data = await livraisonService.getLivreursDisponibles();
      setLivreurs(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchCommandes();
    fetchLivreurs();
  }, [fetchCommandes, fetchLivreurs]);

  const filteredCommandes = commandes.filter(cmd => {
    const term = searchTerm.toLowerCase();
    return (cmd.client || '').toLowerCase().includes(term) ||
           (cmd.reference || '').toLowerCase().includes(term);
  });

  const assignerLivreur = async (commandeId, livreurId) => {
    if (!livreurId) {
      triggerNotification('Veuillez choisir un livreur', 'error');
      return;
    }
    setAssigning(true);
    try {
      await livraisonService.assignerLivreur(commandeId, livreurId);
      triggerNotification('Livreur assigné avec succès !', 'success');
      await fetchCommandes();
      await fetchLivreurs();
      setSelectedLivreur(prev => ({ ...prev, [commandeId]: '' }));
    } catch (err) {
      triggerNotification(err.message, 'error');
    } finally {
      setAssigning(false);
      const payload = { livreur_id: parseInt(livreurId) };
      await livraisonService.assignerLivreur(commandeId, payload.livreur_id);
  };
  };

  

  const triggerNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Stats
  const stats = {
    total: commandes.length,
    enAttente: commandes.filter(c => c.statut_livraison === 'En attente').length,
    enCours: commandes.filter(c => c.statut_livraison === 'En cours').length,
    livrees: commandes.filter(c => c.statut_livraison === 'Livrée').length
  };

  const statCards = [
    { id: 1, nom: 'Total commandes', valeur: stats.total, icon: Truck, color: 'blue' },
    { id: 2, nom: 'En attente', valeur: stats.enAttente, icon: Clock, color: 'yellow' },
    { id: 3, nom: 'En cours', valeur: stats.enCours, icon: RefreshCw, color: 'purple' },
    { id: 4, nom: 'Livrées', valeur: stats.livrees, icon: CheckCircle, color: 'green' }
  ];

  const getStatutColor = (statut) => {
    const colors = {
      'En attente': 'bg-yellow-100 text-yellow-800',
      'Collectée': 'bg-blue-100 text-blue-800',
      'En cours': 'bg-purple-100 text-purple-800',
      'Livrée': 'bg-green-100 text-green-800',
      'Annulée': 'bg-red-100 text-red-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  // Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } }
  };
  const tableRowVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: (i) => ({ x: 0, opacity: 1, transition: { delay: i * 0.03, duration: 0.2 } })
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col bg-gray-50 min-h-screen w-250"
    >
      <NavBarHorizontal
        buttonLabel="AJOUTER UN LIVREUR"
        onButtonClick={() => console.log('Ajouter une commande')}
        onSearch={(term) => setSearchTerm(term)}
        placeholder="Rechercher par client ou référence..."
      />

      <div className="p-6">
        <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-6">
          Gestion des livraisons
        </motion.h1>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{card.nom}</p>
                    <p className="text-2xl font-bold text-gray-800">{card.valeur}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-${card.color}-50 text-${card.color}-500`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tableau */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && <div className="text-center py-8 text-gray-500">Chargement des commandes...</div>}
          {error && <div className="text-red-600 text-center py-8">{error}</div>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Réf.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Adresse livraison</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Livreur</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                    
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredCommandes.map((cmd, idx) => (
                    <motion.tr
                      key={cmd.id}
                      custom={idx}
                      initial="hidden"
                      animate="visible"
                      variants={tableRowVariants}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {cmd.reference || cmd.id?.substring(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {cmd.client || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <div className="flex items-start gap-1">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>{cmd.adresse_livraison || cmd.adresse_collecte || 'Non'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {cmd.livreur_id ? (
                          <span className="text-sm text-gray-700">
                            {cmd.livreur_nom || 'Livreur assigné'}
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              value={selectedLivreur[cmd.id] || ''}
                              onChange={(e) => setSelectedLivreur(prev => ({ ...prev, [cmd.id]: e.target.value }))}
                              className="text-xs border rounded px-2 py-1 w-32"
                            >
                              <option value="">Choisir</option>
                              {livreurs.map(l => (
                                <option key={l.id} value={l.id}>
                                  {l.prenom} {l.nom}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => assignerLivreur(cmd.id, selectedLivreur[cmd.id])}
                              disabled={assigning}
                              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded disabled:opacity-50"
                            >
                              Assigner
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
    <span className={`text-xs px-2 py-1 rounded-full ${getStatutColor(cmd.statut || 'En attente')}`}>
        {cmd.statut || 'En attente'}
    </span>
</td>
                      
                    </motion.tr>
                  ))}
                  {filteredCommandes.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">
                        Aucune commande trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed bottom-5 right-5 z-50"
          >
            <div className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border text-sm font-medium max-w-sm bg-white ${
              notification.type === 'success' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <p className="text-gray-700">{notification.message}</p>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}