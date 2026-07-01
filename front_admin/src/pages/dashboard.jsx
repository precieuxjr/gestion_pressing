import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shirt, Truck, Undo2, DollarSign } from 'lucide-react';
import illus_person from '../assets/dashboard/undraw_all-the-data_ijgn.svg';
import { commandesService } from '../services/commandes';
import { decodeToken } from '../utils/jwt';
import NavBarHorizontal from '../components/navbar_horizontal';

// Variants d'animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
};

const tableRowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: (i) => ({
    x: 0,
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.2 },
  }),
};

export default function Dashboard() {
  const [user] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? decodeToken(token) : null;
  });
  const [stats, setStats] = useState({
    aRecuperer: 0,
    aLivrer: 0,
    rembourses: 0,
    revenuMensuel: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const orders = await commandesService.getAll();
      setRecentOrders(orders.slice(0, 5));

      const totalRecuperer = orders.filter(
        (o) => o.status === 'En attente' || o.status === 'En cours'
      ).length;
      const totalLivrer = orders.filter(
        (o) => o.status === 'Livrée' || o.status === 'Prête à retirer'
      ).length;
      const totalRembourses = orders.filter(
        (o) => o.status === 'Annulée'
      ).length;
      const revenu = orders
        .filter((o) => o.status === 'Payée' || o.status === 'Livrée')
        .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

      setStats({
        aRecuperer: totalRecuperer,
        aLivrer: totalLivrer,
        rembourses: totalRembourses,
        revenuMensuel: revenu,
      });
      setError(null);
    } catch (err) {
      console.error('Erreur chargement dashboard :', err);
      setError('Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Indicateurs pour les cartes
  const statsCards = [
    {
      id: 1,
      nom: 'Vêtement à récupérer',
      icon: Shirt,
      result: stats.aRecuperer,
      unit: 'Unité',
    },
    {
      id: 2,
      nom: 'Vêtement à livrer',
      icon: Truck,
      result: stats.aLivrer,
      unit: 'Unité',
    },
    {
      id: 3,
      nom: 'Client remboursé',
      icon: Undo2,
      result: stats.rembourses,
      unit: 'Unité',
    },
    {
      id: 4,
      nom: 'Revenu mensuel',
      icon: DollarSign,
      result: stats.revenuMensuel.toLocaleString() + ' FC',
      unit: 'Devise',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Chargement du tableau de bord...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 dark:text-red-400 text-center p-6">{error}</div>;
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 w-full"
    >
      {/* NavBar horizontale (recherche + bouton) */}
      <NavBarHorizontal
        buttonLabel="Nouvelle commande"
        onButtonClick={() => console.log('Ajouter une commande')}
        onSearch={(term) => console.log('Recherche :', term)}
      />

      <div className="flex flex-col flex-1 p-4 md:p-6">
        {/* Welcome block */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row items-center my-4 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-blue-100 dark:border-blue-800 shadow-xl shadow-blue-500/30 dark:shadow-blue-900/30"
        >
          <div className="flex-1 px-2 md:px-4 py-2">
            <h1 className="text-black dark:text-white font-semibold text-lg md:text-xl">
              <span className="text-blue-500 dark:text-blue-400 font-semibold">
                Bienvenue{' '}
              </span>
              sur votre tableau de bord,
              <span className="text-blue-500 dark:text-blue-400 font-bold">
                {' '}
                {user?.prenom || 'PRECIEUX'}
              </span>
            </h1>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-1">
              Consultez en temps réel les commandes, clients et performances.
              Gérez les opérations quotidiennes, analysez les tendances et
              améliorez la satisfaction client.
            </p>
            <Link to="/admin/clients">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-xs md:text-sm p-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold uppercase my-2 rounded-xl transition-colors"
              >
                Évolution Clientèle
              </motion.button>
            </Link>
          </div>
          <div className="hidden md:block w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
  <motion.img
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.4 }}
    src={illus_person}
    alt="Illustration d'une personne"
    className="w-full h-full object-contain"
  />
</div>
        </motion.div>

        <main className="flex flex-col my-4 pb-2">
          {/* Stats cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center"
          >
            {statsCards.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="w-full max-w-xs relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-4 shadow-sm border border-blue-100 dark:border-blue-800"
              >
                <div className="flex justify-between items-start">
                  <item.icon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-full">
                    {item.unit}
                  </span>
                </div>
                <p className="mt-4 text-xl md:text-2xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
                  {item.result}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.nom}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Section des commandes récentes */}
          <div className="my-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-row p-3 justify-between rounded-t-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-b-0 border-blue-100 dark:border-blue-800"
            >
              <p className="text-[13px] font-bold text-gray-800 dark:text-white">
                GESTION DES COMMANDES
              </p>
              <Link to="/admin/commandes">
                <motion.span
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[13px] font-bold flex justify-end text-blue-500 dark:text-blue-400 cursor-pointer"
                >
                  VOIR PLUS
                </motion.span>
              </Link>
            </motion.div>

            <div className="overflow-x-auto border border-t-0 border-blue-100 dark:border-blue-800 rounded-b-lg bg-white dark:bg-gray-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      N°COMMANDE
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      CLIENT
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      SERVICE
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      STATUT
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500 dark:text-gray-400">
                        Aucune commande récente
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order, idx) => (
                      <motion.tr
                        key={order.id}
                        custom={idx}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">
                          {order.reference || order.id}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
                          {order.client || '—'}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
                          {order.service_nom || '—'}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
                          <span
                            className={`
                              inline-block px-2 py-1 text-xs font-medium rounded-full
                              ${order.status === 'Payée' || order.status === 'Livrée'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : order.status === 'Annulée'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                : order.status === 'Prêt' || order.status === 'Prête à retirer'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                : order.status === 'Retirer'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              }
                            `}
                          >
                            {order.status || 'En attente'}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </motion.section>
  );
}