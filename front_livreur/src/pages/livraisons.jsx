import { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  Eye,
  Search,
  MapPin
} from 'lucide-react';

// Données fictives (à remplacer par un appel API)
const mockLivraisons = [
  {
    id: 'LIV-001',
    commandeId: 'CMD-001',
    client: 'Jean Dupont',
    adresse: '12 Avenue des Fleurs, Kinshasa',
    statut: 'en_attente',
    datePlanifiee: '2026-06-16',
    heureEstimee: '14:30',
    montant: 25.50,
  },
  {
    id: 'LIV-002',
    commandeId: 'CMD-002',
    client: 'Marie Kabasele',
    adresse: '45 Rue du Commerce, Lubumbashi',
    statut: 'en_cours',
    datePlanifiee: '2026-06-16',
    heureEstimee: '10:00',
    montant: 32.00,
  },
  {
    id: 'LIV-003',
    commandeId: 'CMD-003',
    client: 'Pierre Kasongo',
    adresse: '7 Boulevard du 30 Juin, Kinshasa',
    statut: 'terminee',
    datePlanifiee: '2026-06-15',
    heureEstimee: '09:30',
    montant: 18.75,
  },
  {
    id: 'LIV-004',
    commandeId: 'CMD-004',
    client: 'Chantal Mukendi',
    adresse: '22 Cité des Jeunes, Goma',
    statut: 'en_attente',
    datePlanifiee: '2026-06-16',
    heureEstimee: '16:00',
    montant: 40.00,
  },
];

const statutOptions = [
  { value: 'toutes', label: 'Toutes' },
  { value: 'en_attente', label: 'À livrer' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'terminee', label: 'Terminées' },
];

const statutConfig = {
  en_attente: { label: 'À livrer', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  en_cours: { label: 'En cours', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  terminee: { label: 'Terminée', color: 'bg-green-100 text-green-800 border-green-200' },
};

export default function LivreurLivraisons() {
  const [filtreStatut, setFiltreStatut] = useState('toutes');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les livraisons
  const livraisonsFiltrees = mockLivraisons.filter((liv) => {
    const matchStatut = filtreStatut === 'toutes' || liv.statut === filtreStatut;
    const matchSearch = liv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        liv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        liv.adresse.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatut && matchSearch;
  });

  // Statistiques
  const total = mockLivraisons.length;
  const enAttente = mockLivraisons.filter(l => l.statut === 'en_attente').length;
  const enCours = mockLivraisons.filter(l => l.statut === 'en_cours').length;
  const terminees = mockLivraisons.filter(l => l.statut === 'terminee').length;

  const handleChangerStatut = (id, nouveauStatut) => {
    // Logique API + mise à jour locale
    console.log(`Changer livraison ${id} vers ${nouveauStatut}`);
    alert(`Statut de la livraison ${id} mis à jour vers "${nouveauStatut}"`);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mes livraisons</h1>
        <p className="text-gray-500">Suivez et gérez vos tournées de livraison.</p>
      </div>

      {/* Cartes récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total livraisons</p>
              <p className="text-2xl font-bold text-gray-800">{total}</p>
            </div>
            <Package className="text-emerald-500" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">À livrer</p>
              <p className="text-2xl font-bold text-gray-800">{enAttente}</p>
            </div>
            <Clock className="text-yellow-400" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En cours</p>
              <p className="text-2xl font-bold text-gray-800">{enCours}</p>
            </div>
            <Truck className="text-blue-400" size={28} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Terminées</p>
              <p className="text-2xl font-bold text-gray-800">{terminees}</p>
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
            placeholder="Rechercher par client, adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Tableau des livraisons */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date / Heure</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {livraisonsFiltrees.length > 0 ? (
                livraisonsFiltrees.map((liv) => {
                  const stat = statutConfig[liv.statut];
                  return (
                    <tr key={liv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{liv.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{liv.commandeId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{liv.client}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400" />
                          {liv.adresse}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stat.color}`}>
                          {stat.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {liv.datePlanifiee} <span className="text-xs text-gray-400">à {liv.heureEstimee}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="text-gray-500 hover:text-emerald-600 transition-colors"
                            title="Voir détails"
                          >
                            <Eye size={18} />
                          </button>
                          {liv.statut === 'en_attente' && (
                            <button
                              onClick={() => handleChangerStatut(liv.id, 'en_cours')}
                              className="text-blue-500 hover:text-blue-700 text-xs font-medium px-2 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                            >
                              Démarrer
                            </button>
                          )}
                          {liv.statut === 'en_cours' && (
                            <button
                              onClick={() => handleChangerStatut(liv.id, 'terminee')}
                              className="text-green-500 hover:text-green-700 text-xs font-medium px-2 py-1 rounded border border-green-200 hover:bg-green-50 transition-colors"
                            >
                              Terminer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    Aucune livraison trouvée.
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