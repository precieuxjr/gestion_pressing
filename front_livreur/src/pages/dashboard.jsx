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
        // Récupérer les statistiques
        const statsData = await getMesStatistiques();
        console.log('📊 Statistiques reçues :', statsData);

        // Récupérer les commandes
        const commandesData = await getMesCommandes();
        console.log('📦 Commandes reçues :', commandesData);

        // Mapper les statistiques
        setStats({
          total: statsData.data?.total || 0,
          enCours: statsData.data?.en_cours || 0,
          livrees: statsData.data?.livrees || 0,
          enAttente: statsData.data?.en_attente || 0,
          collectees: statsData.data?.collectees || 0
        });

        // Mapper les commandes (prendre les 5 plus récentes)
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

  // Fonction pour déterminer la couleur du badge selon le statut de livraison
  const getStatutBadge = (statut) => {
    const s = statut?.toLowerCase().trim() || '';
    if (s === 'en cours' || s === 'encours') return 'bg-blue-100 text-blue-700';
    if (s === 'en attente' || s === 'enattente') return 'bg-yellow-100 text-yellow-700';
    if (s === 'livrée' || s === 'livree') return 'bg-green-100 text-green-700';
    if (s === 'collectée' || s === 'collectee') return 'bg-purple-100 text-purple-700';
    if (s === 'annulée' || s === 'annulee') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  // Traduction du statut pour l'affichage
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          <p className="text-gray-500">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-lg mx-auto">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord livreur</h1>
        <p className="text-gray-500 mt-1">Bienvenue ! Voici un récapitulatif de vos livraisons du jour.</p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total commandes</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Package size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">En cours</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.enCours}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Truck size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">En attente</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.enAttente}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Livrées</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.livrees}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Liste des commandes récentes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Commandes récentes</h2>
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
            Voir tout <ArrowRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Commande</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Adresse</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {commandesRecentes.map((commande) => (
                <tr key={commande.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{commande.id}</td>
                  <td className="px-6 py-4 text-gray-700">{commande.client}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="truncate max-w-[150px]">{commande.adresse}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      {commande.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutBadge(commande.statut)}`}>
                      {traduireStatut(commande.statut)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-emerald-600 hover:text-emerald-800 font-medium text-xs">
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {commandesRecentes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune commande récente à afficher.
          </div>
        )}
      </div>

      {/* Section conseil (inchangée) */}
      <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Truck size={20} className="text-emerald-600" />
          <p className="text-sm text-emerald-800">
            <span className="font-semibold">Conseil :</span> N’oubliez pas de valider vos livraisons dès qu’elles sont effectuées.
          </p>
        </div>
        <button className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-colors">
          Marquer comme terminée
        </button>
      </div>
    </div>
  );
}