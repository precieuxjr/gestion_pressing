import { useState, useEffect, useCallback } from 'react';
import { commandesService } from '../services/commandes';
import { livraisonService } from '../services/livraison';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import toast from 'react-hot-toast';
// import { socket } from '../services/socket'; // <-- SUPPRIMÉ
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
    // ✅ Plus d'écoute WebSocket
  }, [fetchCommandes, fetchLivreurs]);
  // Filtrage par recherche
  const filtered = commandes.filter((cmd) => {
    const term = searchTerm.toLowerCase();
    return (
      (cmd.reference || '').toLowerCase().includes(term) ||
      (cmd.client || '').toLowerCase().includes(term) ||
      (cmd.phone || '').includes(term)
    );
  });

  // Formatage de la date
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

  // Assigner un livreur
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

  // Annuler l'assignation
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Commandes payées</h1>
          <p className="text-gray-500">Liste des commandes dont le paiement a été validé</p>
        </div>
        <button
          onClick={fetchCommandes}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          Rafraîchir
        </button>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher par référence, client, téléphone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        {error && (
          <div className="text-center py-8 text-red-600">{error}</div>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Livreur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      Aucune commande payée trouvée.
                    </td>
                  </tr>
                ) : (
                  filtered.map((cmd) => (
                    <tr key={cmd.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {cmd.reference || cmd.id?.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {cmd.client || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cmd.phone || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {cmd.amount ? `${cmd.amount.toLocaleString()} FC` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(cmd.created_at || cmd.depositDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cmd.livreur_id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">
                              {cmd.livreur_nom || 'Assigné'}
                            </span>
                            <button
                              onClick={() => annulerAssignation(cmd.id)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
                              title="Annuler l'assignation"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              value={selectedLivreur[cmd.id] || ''}
                              onChange={(e) => setSelectedLivreur(prev => ({ ...prev, [cmd.id]: e.target.value }))}
                              className="text-xs border rounded px-2 py-1 w-32"
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
                              className="text-white text-xs px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                            >
                              Assigner
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
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