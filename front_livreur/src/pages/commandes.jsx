// src/pages/LivreurCommandes.jsx
import { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  Eye,
  Search,
  Loader2,
  AlertCircle,
  XCircle,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getMesCommandes,
  updateStatutLivraison
} from '../services/commandes';

// Mapping des statuts de livraison pour l'affichage
const mapStatutLivraison = (statut) => {
  const mapping = {
    'En attente': 'en_attente',
    'Collectée': 'collectee',
    'En cours': 'en_cours',
    'Livrée': 'livree'
  };
  return mapping[statut] || statut;
};

const statutLivraisonConfig = {
  en_attente: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700'
  },
  collectee: {
    label: 'Collectée',
    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
  },
  en_cours: {
    label: 'En cours',
    color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700'
  },
  livree: {
    label: 'Livrée',
    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
  }
};

const statutOptions = [
  { value: 'toutes', label: 'Tous' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'collectee', label: 'Collectée' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'livree', label: 'Livrée' }
];

export default function LivreurCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtreStatut, setFiltreStatut] = useState('toutes');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCommandes = async () => {
    try {
      setLoading(true);
      const data = await getMesCommandes();
      const payees = data.data.filter(item => item.status === 'Payée');
      const formatted = payees.map(item => ({
        id: item.id,
        client: item.client,
        adresse: item.adresse_livraison || item.adresse_collecte,
        statut_livraison: item.statut_livraison || 'En attente',
        statut_livraison_cle: mapStatutLivraison(item.statut_livraison || 'En attente'),
        date: item.depositDate ? new Date(item.depositDate).toLocaleDateString() : '',
        // ✅ Récupération de la date de dernière modification (priorité à updated_at)
        updated_at: item.updatedAt || item.updated_at || item.depositDate,
        montant: item.amount || 0,
        livreur_id: item.livreur_id
      }));

      // ✅ Tri par date de modification décroissante (la plus récente en premier)
      formatted.sort((a, b) => {
        const dateA = a.updated_at ? new Date(a.updated_at) : new Date(0);
        const dateB = b.updated_at ? new Date(b.updated_at) : new Date(0);
        return dateB - dateA;
      });

      setCommandes(formatted);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Erreur de chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  const commandesFiltrees = commandes.filter((cmd) => {
    const matchStatut = filtreStatut === 'toutes' || cmd.statut_livraison_cle === filtreStatut;
    const matchSearch = cmd.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        cmd.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatut && matchSearch;
  });

  const total = commandes.length;
  const enAttente = commandes.filter(c => c.statut_livraison_cle === 'en_attente').length;
  const collectees = commandes.filter(c => c.statut_livraison_cle === 'collectee').length;
  const livrees = commandes.filter(c => c.statut_livraison_cle === 'livree').length;

  const handleChangerStatut = async (id, nouveauStatut) => {
    try {
      await updateStatutLivraison(id, nouveauStatut);
      await fetchCommandes();
      toast.success(`Statut mis à jour : ${nouveauStatut}`, {
        icon: <Check className="w-5 h-5 text-green-600" />
      });
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la mise à jour', {
        icon: <XCircle className="w-5 h-5 text-red-500" />
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-emerald-500 dark:text-emerald-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6 max-w-lg text-center">
          <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400 mx-auto mb-3" />
          <h3 className="text-red-700 dark:text-red-300 font-semibold">Erreur</h3>
          <p className="text-red-600 dark:text-red-200">{error}</p>
          <button
            onClick={fetchCommandes}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-gray-900 p-4 md:p-6">
      {/* En-tête centré */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Mes commandes</h1>
        <p className="text-gray-500 dark:text-gray-400">Gérez les livraisons qui vous sont assignées.</p>
      </div>

      {/* Cartes statistiques - centrées et responsive */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-emerald-500 dark:border-emerald-400 flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{total}</p>
          </div>
          <Package className="text-emerald-500 dark:text-emerald-400" size={24} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-yellow-400 dark:border-yellow-500 flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">En attente</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{enAttente}</p>
          </div>
          <Clock className="text-yellow-400 dark:text-yellow-500" size={24} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-blue-400 dark:border-blue-500 flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Collectées</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{collectees}</p>
          </div>
          <Truck className="text-blue-400 dark:text-blue-500" size={24} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-green-400 dark:border-green-500 flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Livrées</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{livrees}</p>
          </div>
          <CheckCircle className="text-green-400 dark:text-green-500" size={24} />
        </div>
      </div>

      {/* Filtres et recherche - centrés et responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="statut" className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrer :</label>
          <select
            id="statut"
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
          >
            {statutOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={18} />
        </div>
      </div>

      {/* Tableau - responsive et compatible */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Adresse</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Montant</th>
                <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {commandesFiltrees.length > 0 ? (
                commandesFiltrees.map((cmd) => {
                  const stat = statutLivraisonConfig[cmd.statut_livraison_cle] || {
                    label: cmd.statut_livraison,
                    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  };
                  return (
                    <tr key={cmd.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{cmd.id}</td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{cmd.client}</td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate hidden sm:table-cell">{cmd.adresse}</td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stat.color}`}>
                          {stat.label}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{cmd.date}</td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white hidden lg:table-cell">{cmd.montant} €</td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-1 md:gap-2 flex-wrap">
                          <button
                            className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            title="Voir détails"
                          >
                            <Eye size={18} />
                          </button>

                          {cmd.statut_livraison_cle === 'en_attente' && (
                            <button
                              onClick={() => handleChangerStatut(cmd.id, 'Collectée')}
                              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium px-2 py-1 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                              Collecter
                            </button>
                          )}
                          {cmd.statut_livraison_cle === 'collectee' && (
                            <button
                              onClick={() => handleChangerStatut(cmd.id, 'En cours')}
                              className="text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-xs font-medium px-2 py-1 rounded border border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                            >
                              Démarrer
                            </button>
                          )}
                          {cmd.statut_livraison_cle === 'en_cours' && (
                            <button
                              onClick={() => handleChangerStatut(cmd.id, 'Livrée')}
                              className="text-green-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-xs font-medium px-2 py-1 rounded border border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                            >
                              Livrer
                            </button>
                          )}
                          {cmd.statut_livraison_cle === 'livree' && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">Terminée</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Aucune commande trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}