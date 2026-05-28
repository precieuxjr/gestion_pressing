import { motion } from 'framer-motion';
import Navbar from '../components/nav_admin';
import {
  Shirt,
  Truck,
  Undo2,
  DollarSign,
} from 'lucide-react';
import { Bell } from 'lucide-react';
import Theme from '../components/theme';
import illus_person from '../assets/dashboard/undraw_all-the-data_ijgn.svg';


// Variants for staggered children
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
  const stats = [
    { id: 1, nom: 'Vêtement à récupérer', icon: Shirt, result: '100' },
    { id: 2, nom: 'VÊTEMENT À LIVRER', icon: Truck, result: '' },
    { id: 3, nom: 'Client remboursé', icon: Undo2, result: '' },
    { id: 4, nom: 'REVENUE MENSUEL', icon: DollarSign, result: '' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-row min-h-screen overflow-x-hidden w-full bg-gray-300"
    >
      <nav>
        <Navbar />
      </nav>

      <div className="flex flex-col flex-1 bg-gray-50">
        {/* Header with slide down */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="top-1 flex flex-row justify-between items-center mx-8"
        >
          <Theme />
          <div className="flex flex-col">
            <span className="text-blue-600 text-[11px] text-center tracking-wider">
              Dashboard
            </span>
            <h1 className="font-bold text-[12px]">Console de Pilotage</h1>
          </div>
          <div className="flex flex-row items-center gap-1">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Bell className="w-7 h-7 p-1 bg-gray-200 rounded-lg" />
            </motion.div>
            <div className="h-5 border border-gray-300"></div>
            <p className="text-[12px] font-bold">PRECIEUX MAYELA</p>
          </div>
        </motion.header>

        {/* Welcome block with fade left */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-row my-4 rounded-2xl h-30 mx-8 bg-linear-to-br from-white to-blue-50 border border-blue-100 pb-2 shadow-xl shadow-blue-500/30"
        >
          <div className="px-4 py-2">
            <h1 className="text-black font-semibold">
              <span className="text-blue-500 font-semibold text-2xl">
                Bienvenue{' '}
              </span>
              sur votre tableau de bord,
              <span className="text-blue-500 font-bold"> PRECIEUX</span>
            </h1>
            <p className="text-[11px]">
              Consultez en temps réel les commandes, clients et performances.
              Gérez les opérations quotidiennes, analysez les tendances et
              améliorez la satisfaction client
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-[12px] p-2 bg-blue-500 text-white font-semibold uppercase my-1 rounded-xl"
            >
              Evolution Commandes
            </motion.button>
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
          {/* Stats cards with staggered animation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-4 gap-4 justify-items-center"
          >
            {stats.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative w-55 overflow-hidden rounded-xl bg-linear-to-br from-white to-blue-50 p-4 shadow-sm border border-blue-100"
              >
                <div className="flex justify-between items-start">
                  <item.icon className="w-6 h-6 text-blue-500" />
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    Unité
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold text-gray-800">
                  {item.result || '0'}
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
              className="flex flex-row p-3 justify-between rounded-t-lg bg-linear-to-br from-white to-blue-50"
            >
              <p className="text-[13px] font-bold">GESTION DES COMMANDES</p>
              <motion.span
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="text-[13px] font-bold flex justify-end text-blue-500 cursor-pointer"
              >
                VOIR PLUS
              </motion.span>
            </motion.div>

            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°COMMANDE</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOM</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE SERVICE</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUT</th>
                  
                </tr>
              </thead>
              <tbody>
                {[
                  { id: '#CMD001', name: 'Jean Dupont', service: 'Nettoyage à sec', status: 'En cours' },
                  { id: '#CMD002', name: 'Marie Curie', service: 'Repassage', status: 'Terminé' },
                  { id: '#CMD003', name: 'Marie Curie', service: 'Repassage', status: 'Terminé' },
                  { id: '#CMD004', name: 'Marie Curie', service: 'Repassage', status: 'Terminé' },
                ].map((row, idx) => (
                  <motion.tr
                    key={idx}
                    custom={idx}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 text-sm text-gray-900">{row.id}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{row.name}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{row.service}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{row.status}</td>

                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <div>
          <div></div>
          <div></div>
        </div>
      </div>
    </motion.section>
  );
}