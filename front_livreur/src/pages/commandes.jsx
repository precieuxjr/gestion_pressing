// src/pages/LivreurCommandes.jsx
import { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  Eye,
  Search
} from 'lucide-react';

// Import du service
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
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  collectee: { label: 'Collectée', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  en_cours: { label: 'En cours', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  livree: { label: 'Livrée', color: 'bg-green-100 text-green-800 border-green-200' }
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

  // Récupérer les commandes assignées au livreur (filtrées sur 'Payée')
  const fetchCommandes = async () => {
    try {
      setLoading(true);
      const data = await getMesCommandes();
      
      // Filtrer les commandes payées (statut général = 'Payée')
      const payees = data.data.filter(item => item.status === 'Payée');
      
      const formatted = payees.map(item => ({
        id: item.id,
        client: item.client,
        adresse: item.adresse_livraison || item.adresse_collecte,
        statut_livraison: item.statut_livraison || 'En attente', // brut
        statut_livraison_cle: mapStatutLivraison(item.statut_livraison || 'En attente'),
        date: item.depositDate ? new Date(item.depositDate).toLocaleDateString() : '',
        montant: item.amount || 0,
        livreur_id: item.livreur_id
      }));
      
      setCommandes(formatted);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  // Filtrage par recherche et statut de livraison
  const commandesFiltrees = commandes.filter((cmd) => {
    const matchStatut = filtreStatut === 'toutes' || cmd.statut_livraison_cle === filtreStatut;
    const matchSearch = cmd.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        cmd.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatut && matchSearch;
  });

  // Statistiques (basées sur statut de livraison)
  const total = commandes.length;
  const enAttente = commandes.filter(c => c.statut_livraison_cle === 'en_attente').length;
  const collectees = commandes.filter(c => c.statut_livraison_cle === 'collectee').length;
  const enCours = commandes.filter(c => c.statut_livraison_cle === 'en_cours').length;
  const livrees = commandes.filter(c => c.statut_livraison_cle === 'livree').length;

  // Mise à jour du statut de livraison
  const handleChangerStatut = async (id, nouveauStatut) => {
    try {
      await updateStatutLivraison(id, nouveauStatut);
      await fetchCommandes();
      alert(`Statut de livraison mis à jour : ${nouveauStatut}`);
    } catch (err) {
      alert(err.message);
    }
  };
  // Affichage du chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  // Affichage d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-lg">
          <h3 className="text-red-700 font-semibold">Erreur</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchCommandes}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mes commandes</h1>
        <p className="text-gray-500">Gérez les livraisons qui vous sont assignées.</p>
      </div>

      {/* Cartes récapitulatives (statistiques des statuts de livraison) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total commandes</p>
              <p className="text-2xl font-bold text-gray-800">{total}</p>
            </div>
            <Package className="text-emerald-500" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-gray-800">{enAttente}</p>
            </div>
            <Clock className="text-yellow-400" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Collectées</p>
              <p className="text-2xl font-bold text-gray-800">{collectees}</p>
            </div>
            <Truck className="text-blue-400" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Livrées</p>
              <p className="text-2xl font-bold text-gray-800">{livrees}</p>
            </div>
            <CheckCircle className="text-green-400" size={28} />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="statut" className="text-sm font-medium text-gray-700">Filtrer :</label>
          <select
            id="statut"
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {statutOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Rechercher une commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Tableau des commandes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut livraison</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {commandesFiltrees.length > 0 ? (
                commandesFiltrees.map((cmd) => {
                  const stat = statutLivraisonConfig[cmd.statut_livraison_cle] || { label: cmd.statut_livraison, color: 'bg-gray-100 text-gray-800' };
                  return (
                    <tr key={cmd.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{cmd.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cmd.client}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{cmd.adresse}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stat.color}`}>
                          {stat.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cmd.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{cmd.montant} €</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="text-gray-500 hover:text-emerald-600 transition-colors"
                            title="Voir détails"
                          >
                            <Eye size={18} />
                          </button>
                          {cmd.statut_livraison_cle === 'en_attente' && (
  <button
    onClick={() => handleChangerStatut(cmd.id, 'Collectée')}
    className="text-blue-500 hover:text-blue-700 text-xs font-medium px-2 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
  >
    Collecter
  </button>
)}
                        
                          {cmd.statut_livraison_cle === 'en_cours' && (
                            <button
                              onClick={() => handleChangerStatut(cmd.id, 'Collectée')}
                              className="text-green-500 hover:text-green-700 text-xs font-medium px-2 py-1 rounded border border-green-200 hover:bg-green-50 transition-colors"
                            >
                              Collecter
                            </button>
                          )}
                          {cmd.statut_livraison_cle === 'livree' && (
                            <span className="text-xs text-gray-400">Terminée</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
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