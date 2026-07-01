import { useState, useEffect, useCallback } from 'react';
import { commandesService } from '../services/commandes';
import { livraisonService } from '../services/livraison';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import NavBarHorizontal from '../components/navbar_horizontal';

export default function CommandesPayees() {
  const [commandes, setCommandes] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLivreur, setSelectedLivreur] = useState({});
  const [assigning, setAssigning] = useState(false);

  const fetchCommandes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await commandesService.getPayees();
      const filtrees = (data || []).filter((cmd) => {
        const statut = cmd.statut_livraison?.trim().toLowerCase();
        return statut !== 'collectée' && statut !== 'collectee' &&
               statut !== 'en cours' && statut !== 'encours' &&
               statut !== 'livrée' && statut !== 'livree';
      });
      setCommandes(filtrees);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Erreur chargement des commandes payées');
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

  const filtered = commandes.filter((cmd) => {
    const term = searchTerm.toLowerCase();
    return (
      (cmd.reference || '').toLowerCase().includes(term) ||
      (cmd.client || '').toLowerCase().includes(term) ||
      (cmd.phone || '').includes(term)
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const assignerLivreur = async (commandeId, livreurId) => {
    if (!livreurId) {
      toast.error('Veuillez sélectionner un livreur');
      return;
    }
    setAssigning(true);
    try {
      await livraisonService.assignerLivreur(commandeId, livreurId);
      toast.success('Livreur assigné avec succès !');
      await fetchCommandes();
      setSelectedLivreur((prev) => ({ ...prev, [commandeId]: '' }));
    } catch (err) {
      toast.error(err.message || 'Erreur lors de l\'assignation');
    } finally {
      setAssigning(false);
    }
  };

  const annulerAssignation = async (commandeId) => {
    if (!window.confirm('Voulez-vous vraiment annuler l\'assignation de cette commande ?')) return;
    try {
      await livraisonService.annulerAssignation(commandeId);
      toast.success('Assignation annulée avec succès');
      await fetchCommandes();
    } catch (err) {
      toast.error(err.message || 'Erreur lors de l\'annulation');
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Commandes payées</h1>
          <p className="text-gray-500 dark:text-gray-400">Liste des commandes dont le paiement a été validé</p>
        </div>
        <button
          onClick={fetchCommandes}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
        >
          Rafraîchir
        </button>
      </div>

      {/* Recherche */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6 transition-colors">
        <input
          type="text"
          placeholder="Rechercher par référence, client, téléphone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Tableau */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        )}
        {error && (
          <div className="text-center py-8 text-red-600 dark:text-red-400">{error}</div>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Référence
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Téléphone
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Montant
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Date paiement
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Livreur
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Aucune commande payée trouvée.
                    </td>
                  </tr>
                ) : (
                  filtered.map((cmd) => (
                    <tr key={cmd.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                        {cmd.reference || cmd.id?.substring(0, 8)}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {cmd.client || '—'}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                        {cmd.phone || '—'}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white hidden md:table-cell">
                        {cmd.amount ? `${cmd.amount.toLocaleString()} FC` : '—'}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                        {formatDate(cmd.created_at || cmd.depositDate)}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        {cmd.livreur_id ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {cmd.livreur_nom || 'Assigné'}
                            </span>
                            <button
                              onClick={() => annulerAssignation(cmd.id)}
                              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs font-medium px-2 py-1 rounded border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Annuler l'assignation"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            <select
                              value={selectedLivreur[cmd.id] || ''}
                              onChange={(e) => setSelectedLivreur(prev => ({ ...prev, [cmd.id]: e.target.value }))}
                              className="text-xs border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 w-32 transition-colors"
                            >
                              <option value="">Choisir</option>
                              {livreurs.map((l) => (
                                <option key={l.public_id || `liv-${l.id}`} value={l.public_id || l.id}>
                                  {l.prenom} {l.nom}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => assignerLivreur(cmd.id, selectedLivreur[cmd.id])}
                              disabled={assigning}
                              className="text-white text-xs px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                              Assigner
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                          onClick={() => {}}
                          title="Voir détails"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}