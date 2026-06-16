import { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User, 
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function LivreurDashboard() {
  // Simuler des données (à remplacer par des appels API)
  const [stats, setStats] = useState({
    totalCommandes: 0,
    enCours: 0,
    terminees: 0,
    enAttente: 0
  });

  const [commandesRecentes, setCommandesRecentes] = useState([]);

  // Simulation de chargement de données
  useEffect(() => {
    // Ici, vous ferez un fetch vers votre API
    // Exemple de données factices
    const fakeStats = {
      totalCommandes: 28,
      enCours: 4,
      terminees: 18,
      enAttente: 6
    };
    setStats(fakeStats);

    const fakeCommandes = [
      { id: 'CMD-001', client: 'Jean Dupont', adresse: '12 rue de la Paix, Kinshasa', statut: 'en_livraison', date: '2026-06-16' },
      { id: 'CMD-002', client: 'Marie Claire', adresse: '45 avenue des Fleurs', statut: 'en_attente', date: '2026-06-16' },
      { id: 'CMD-003', client: 'Pierre Kasongo', adresse: '78 boulevard du 30 Juin', statut: 'terminee', date: '2026-06-15' },
      { id: 'CMD-004', client: 'Sophie Ndala', adresse: '23 rue de la Révolte', statut: 'en_livraison', date: '2026-06-16' },
      { id: 'CMD-005', client: 'Alain Mukendi', adresse: '6 avenue de l’Indépendance', statut: 'en_attente', date: '2026-06-16' },
    ];
    setCommandesRecentes(fakeCommandes);
  }, []);

  // Fonction pour déterminer la couleur du statut
  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'en_livraison':
        return 'bg-blue-100 text-blue-700';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-700';
      case 'terminee':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Traduction du statut
  const traduireStatut = (statut) => {
    const map = {
      'en_livraison': 'En livraison',
      'en_attente': 'En attente',
      'terminee': 'Terminée'
    };
    return map[statut] || statut;
  };

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
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCommandes}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Package size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">En livraison</p>
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
            <p className="text-sm font-medium text-gray-500">Terminées</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.terminees}</p>
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

      {/* Section supplémentaire : conseil ou info */}
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