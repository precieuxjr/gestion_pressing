// src/pages/client/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingBag, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  Eye,
  PlusCircle 
} from 'lucide-react';
import { clientService } from '../services/clientService';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_commandes: 0,
    livrees: 0,
    payees: 0,
    annulees: 0,
    total_depense: 0,
  });
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, commandesData] = await Promise.all([
          clientService.getStats(),
          clientService.getCommandes(5, 0), // 5 dernières commandes
        ]);
        setStats(statsData.data);
        setCommandes(commandesData.data || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Cartes statistiques
  const statCards = [
    {
      id: 1,
      label: 'Total commandes',
      value: stats.total_commandes,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      id: 2,
      label: 'Commandes livrées',
      value: stats.livrees,
      icon: CheckCircle,
      color: 'bg-green-500',
      bg: 'bg-green-50',
      text: 'text-green-600',
    },
    {
      id: 3,
      label: 'En attente / Payées',
      value: stats.payees + (stats.total_commandes - stats.livrees - stats.annulees - stats.payees),
      icon: Clock,
      color: 'bg-yellow-500',
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
    },
    {
      id: 4,
      label: 'Total dépensé',
      value: stats.total_depense
        ? `${stats.total_depense.toLocaleString()} FC`
        : '0 FC',
      icon: DollarSign,
      color: 'bg-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
    },
  ];

  // Gestion des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-500">Bienvenue sur votre espace client</p>
        </div>
        <button
          onClick={() => navigate('/client/commandes/nouvelle')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-sm"
        >
          <PlusCircle size={20} />
          Nouvelle commande
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.bg} ${card.text}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tableau des dernières commandes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">📦 Dernières commandes</h2>
          <button
            onClick={() => navigate('/client/commandes')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Voir tout
          </button>
        </div>
        {loading ? (
          <div className="p-6 text-center text-gray-500">Chargement...</div>
        ) : commandes.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Aucune commande pour le moment.
            <br />
            <button
              onClick={() => navigate('/client/commandes/nouvelle')}
              className="mt-2 text-blue-600 hover:underline"
            >
              Créez votre première commande
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {commandes.map((cmd) => (
                  <tr key={cmd.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {cmd.reference || cmd.id?.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cmd.depositDate
                        ? new Date(cmd.depositDate).toLocaleDateString('fr-FR')
                        : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {cmd.amount ? `${cmd.amount.toLocaleString()} FC` : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cmd.status === 'Livrée'
                            ? 'bg-green-100 text-green-800'
                            : cmd.status === 'Annulée'
                            ? 'bg-red-100 text-red-800'
                            : cmd.status === 'Payée'
                            ? 'bg-blue-100 text-blue-800'
                            : cmd.status === 'Prêt'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {cmd.status || 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => navigate(`/client/commandes/${cmd.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <Eye size={16} />
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}