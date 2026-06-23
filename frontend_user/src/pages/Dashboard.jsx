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
  PlusCircle,
  LogOut,
  User
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { clientService } from '../services/clientService';
import ConfirmationModal from '../components/confirmationModal';
import NotificationBadge from '../components/NotificationBadge';

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
  const [user, setUser] = useState(null);

  // États pour le modal
  const [modalOpen, setModalOpen] = useState(false);
  const [commandeToCancel, setCommandeToCancel] = useState(null);
  useEffect(() => {
    // Récupérer l'utilisateur depuis localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, commandesData] = await Promise.all([
        clientService.getStats(),
        clientService.getCommandes(5, 0),
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
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };
  const handleAnnuler = async () => {
    if (!commandeToCancel) return;
    try {
      await clientService.annulerCommande(commandeToCancel);
      toast.success('Commande annulée avec succès !');
      await fetchData();
    } catch (err) {
      toast.error(err.message || 'Erreur lors de l\'annulation');
    } finally {
      setCommandeToCancel(null);
    }
  };

  const openModal = (commandeId) => {
    setCommandeToCancel(commandeId);
    setModalOpen(true);
  };

  // Cartes statistiques
  const statCards = [
    // ... identique
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchData}
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
      <Toaster position="top-right" />
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleAnnuler}
        title="Annuler la commande"
        message="Voulez-vous vraiment annuler cette commande ? Cette action est irréversible."
        confirmLabel="Oui, annuler"
        cancelLabel="Non, garder"
      />

<NotificationBadge />

   {/* 👤 Section utilisateur – version premium */}
<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-md border border-blue-100/50 p-5 mb-6 flex flex-wrap items-center justify-between transition-all duration-300 hover:shadow-lg">
  <div className="flex items-center gap-4">
    {/* Avatar avec effet de glow */}
    <div className="relative">
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-800 to-blue-300 flex items-center justify-center text-white shadow-lg shadow-slate-900/25 ring-4 ring-white">
        <span className="text-xl font-bold">
          {user?.prenom?.charAt(0).toUpperCase()}
          {user?.nom?.charAt(0).toUpperCase()}
        </span>
      </div>
      {/* Petit indicateur de connexion */}
      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
    </div>

    {/* Infos utilisateur */}
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Bienvenue</p>
      <h2 className="text-lg font-bold text-gray-800 leading-tight">
        {user ? `${user.prenom} ${user.nom}` : 'Chargement...'}
      </h2>
      {user?.email && (
        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
      )}
    </div>
  </div>

  {/* Actions */}
  <div className="flex items-center gap-3">
    {/* Badge statut */}
    <div className="hidden sm:flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      En ligne
    </div>

    {/* Bouton déconnexion */}
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-white/80 hover:bg-white text-red-600 font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-red-200/50"
    >
      <LogOut className="w-4 h-4" />
      <span className="text-sm">Déconnexion</span>
    </button>
  </div>
</div>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Vos Commandes</h1>
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

      {/* Tableau des commandes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Dernières commandes</h2>
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Référence</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {commandes.map((cmd) => (
                  <tr key={cmd.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {cmd.reference || cmd.id?.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cmd.depositDate ? new Date(cmd.depositDate).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {cmd.amount ? `${cmd.amount.toLocaleString()} FC` : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cmd.status === 'Livrée'
                          ? 'bg-green-100 text-green-800'
                          : cmd.status === 'Annulée'
                          ? 'bg-red-100 text-red-800'
                          : cmd.status === 'Payée'
                          ? 'bg-blue-100 text-blue-800'
                          : cmd.status === 'Prêt'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cmd.status || 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/client/commandes/${cmd.id}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          <Eye size={16} />
                          Détails
                        </button>
                        {cmd.status === 'En attente' && (
                          <button
                            onClick={() => openModal(cmd.id)}
                            className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                          >
                            Annuler
                          </button>
                        )}
                      </div>
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