import { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Calendar,
  ArrowRight,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getMesStatistiques, getMesCommandes } from '../services/commandes';

export default function LivreurDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    enCours: 0,
    livrees: 0,
    enAttente: 0,
    collectees: 0
  });
  const [commandesRecentes, setCommandesRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsData = await getMesStatistiques();
        console.log('📊 Statistiques reçues :', statsData);

        const commandesData = await getMesCommandes();
        console.log('📦 Commandes reçues :', commandesData);

        setStats({
          total: statsData.data?.total || 0,
          enCours: statsData.data?.en_cours || 0,
          livrees: statsData.data?.livrees || 0,
          enAttente: statsData.data?.en_attente || 0,
          collectees: statsData.data?.collectees || 0
        });

        const rawCommandes = commandesData.data || [];
        const formatted = rawCommandes.slice(0, 5).map(item => ({
          id: item.id,
          client: item.client || 'Client inconnu',
          adresse: item.adresse_livraison || item.adresse_collecte || 'Adresse non fournie',
          statut: item.statut_livraison || 'En attente',
          date: item.depositDate ? new Date(item.depositDate).toLocaleDateString('fr-FR') : '—'
        }));
        setCommandesRecentes(formatted);
        setError(null);
      } catch (err) {
        console.error('❌ Erreur chargement dashboard :', err);
        setError(err.message);
        toast.error('Erreur de chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatutBadge = (statut) => {
    const s = statut?.toLowerCase().trim() || '';
    if (s === 'en cours' || s === 'encours') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700';
    if (s === 'en attente' || s === 'enattente') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
    if (s === 'livrée' || s === 'livree') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
    if (s === 'collectée' || s === 'collectee') return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700';
    if (s === 'annulée' || s === 'annulee') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  const traduireStatut = (statut) => {
    const map = {
      'en cours': 'En cours',
      'en_attente': 'En attente',
      'en attente': 'En attente',
      'livrée': 'Livrée',
      'livree': 'Livrée',
      'collectée': 'Collectée',
      'collectee': 'Collectée',
      'annulée': 'Annulée',
      'annulee': 'Annulée'
    };
    return map[statut?.toLowerCase().trim()] || statut || 'En attente';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#f4f7fb] dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-[#f4f7fb] dark:bg-gray-900 p-4 md:p-6 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6 max-w-lg mx-auto">
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
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
      {/* En-tête */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Tableau de bord livreur
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">
          Bienvenue ! Voici un récapitulatif de vos livraisons du jour.
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Package size={20} className="md:w-6 md:h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">En cours</p>
            <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.enCours}</p>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Truck size={20} className="md:w-6 md:h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">En attente</p>
            <p className="text-xl md:text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.enAttente}</p>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
            <Clock size={20} className="md:w-6 md:h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Livrées</p>
            <p className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.livrees}</p>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <CheckCircle size={20} className="md:w-6 md:h-6" />
          </div>
        </div>
      </div>

      {/* Liste des commandes récentes */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="px-4 md:px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
            Commandes récentes
          </h2>
          <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors">
            Voir tout <ArrowRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 md:px-6 py-3">Commande</th>
                <th className="px-4 md:px-6 py-3">Client</th>
                <th className="px-4 md:px-6 py-3 hidden md:table-cell">Adresse</th>
                <th className="px-4 md:px-6 py-3 hidden sm:table-cell">Date</th>
                <th className="px-4 md:px-6 py-3">Statut</th>
                <th className="px-4 md:px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {commandesRecentes.map((commande) => (
                <tr key={commande.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 md:px-6 py-4 font-medium text-gray-900 dark:text-white text-xs md:text-sm">
                    {commande.id}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-700 dark:text-gray-300 text-xs md:text-sm">
                    {commande.client}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400 dark:text-gray-500" />
                      <span className="truncate max-w-[150px]">{commande.adresse}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
                      {commande.date}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatutBadge(commande.statut)}`}>
                      {traduireStatut(commande.statut)}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium text-xs transition-colors">
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {commandesRecentes.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Aucune commande récente à afficher.
          </div>
        )}
      </div>

      {/* Section conseil */}
        <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 border justify-center border-emerald-100 dark:border-emerald-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors">
        <div className="flex   gap-3">
          <Truck size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-emerald-800 dark:text-emerald-300">
            <span className="font-semibold">Conseil :</span> N’oubliez pas de valider vos livraisons dès qu’elles sont effectuées.
          </p>
        </div>
        
      </div>
    </div>
  );
}