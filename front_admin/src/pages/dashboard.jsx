import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shirt, Truck, Undo2, DollarSign } from 'lucide-react';
import Theme from '../components/theme';
import illus_person from '../assets/dashboard/undraw_all-the-data_ijgn.svg';
import { commandesService } from '../services/commandes';
import { decodeToken } from '../utils/jwt';
// import { socket } from '../services/socket'; // <-- SUPPRIMÉ
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
    // ✅ Plus d'écoute WebSocket
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
      <div className="flex justify-center items-center h-screen">
        Chargement du tableau de bord...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-6">{error}</div>;
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-row min-h-screen overflow-x-hidden w-250 bg-gray-300"
    >
      <div className="flex flex-col flex-1 bg-gray-50">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="top-1 flex flex-row justify-between items-center mx-8"
        >
        <NavBarHorizontal/>
        </motion.header>

        {/* Welcome block */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-row my-4 rounded-2xl h-30 mx-8 bg-gradient-to-br from-white to-blue-50 border border-blue-100 pb-2 shadow-xl shadow-blue-500/30"
        >
          <div className="px-4 py-2">
            <h1 className="text-black font-semibold">
              <span className="text-blue-500 font-semibold text-2xl">
                Bienvenue{' '}
              </span>
              sur votre tableau de bord,
              <span className="text-blue-500 font-bold">
                {' '}
                {user?.prenom || 'PRECIEUX'}
              </span>
            </h1>
            <p className="text-[11px]">
              Consultez en temps réel les commandes, clients et performances.
              Gérez les opérations quotidiennes, analysez les tendances et
              améliorez la satisfaction client
            </p>
            <Link to="/admin/clients">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-[12px] p-2 bg-blue-500 text-white font-semibold uppercase my-1 rounded-xl"
              >
                Evolution Clientele
              </motion.button>
            </Link>
          </div>
          <div className="relative w-30 h-30 mx-10 px-4">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              src={illus_person}
              alt="Illustration d'une personne"
              className="absolute right-2 w-35 h-30 rounded-lg"
            />
          </div>
        </motion.div>

        <main className="flex flex-col my-2 rounded-2xl h-30 mx-8 pb-2">
          {/* Stats cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-4 gap-4 justify-items-center"
          >
            {statsCards.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative w-55 overflow-hidden rounded-xl bg-gradient-to-br from-white to-blue-50 p-4 shadow-sm border border-blue-100"
              >
                <div className="flex justify-between items-start">
                  <item.icon className="w-6 h-6 text-blue-500" />
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {item.unit}
                  </span>
                </div>
                <p className="mt-4 text-xl font-bold text-gray-800 whitespace-nowrap">
                  {item.result}
                </p>
                <p className="text-sm text-gray-500">{item.nom}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="my-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-row p-3 justify-between rounded-t-lg bg-gradient-to-br from-white to-blue-50"
            >
              <p className="text-[13px] font-bold">GESTION DES COMMANDES</p>
              <Link to="/admin/commandes">
                <motion.span
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[13px] font-bold flex justify-end text-blue-500 cursor-pointer"
                >
                  VOIR PLUS
                </motion.span>
              </Link>
            </motion.div>

            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N°COMMANDE
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CLIENT
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SERVICE
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUT
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
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
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-3 py-2 text-sm text-gray-900">
                        {order.reference || order.id}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {order.client || '—'}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {order.service_nom || '—'}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {order.status || 'En attente'}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </motion.section>
  );
}