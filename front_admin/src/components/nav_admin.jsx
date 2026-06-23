import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Shirt,
  CreditCard,
  Truck,
  Settings,
  Package,
  LogOut
} from 'lucide-react';
import profil from '../assets/profil/PHOTO.jpeg';
import { Link, useNavigate } from 'react-router-dom';
import NavbarNotification from './NavbarNotification';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        return;
      } catch (e) {
        console.error('Erreur parsing user', e);
      }
    }
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser(decoded);
      } catch (e) {
        console.error('Erreur décodage token', e);
      }
    }
  }, []);

  const menu = [
    { id: 1, nom: 'Tableau de bord', icon: LayoutDashboard, lien: '/admin/dashboard' },
    { id: 2, nom: 'Gestion des Commandes', icon: ShoppingCart, lien: '/admin/commandes' },
    { id: 3, nom: 'Gestion des Clients', icon: Users, lien: '/admin/clients' },
    { id: 4, nom: 'Services du Pressing', icon: Shirt, lien: '/admin/services' },
    { id: 5, nom: 'Paiement & Facturation', icon: CreditCard, lien: '/admin/paiements' },
    { id: 6, nom: 'Commande à Récupérer', icon: Package, lien: '/admin/recuperer' },
    { id: 7, nom: 'Livraisons', icon: Truck, lien: '/admin/livraisons' }
  ];

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' }
    })
  };

  return (
    <motion.nav
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 flex flex-col min-h-screen bg-gray-50 border-r border-gray-300 items-center w-75"
    >
      {/* Titre + Badge de notification */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex items-center justify-center gap-3 p-4 w-full"
      >
        <div className="text-center">
          <h1 className="text-blue-500 font-bold text-xl">Smart PRESSING</h1>
          <span className="text-sm font-medium text-gray-600">Manager</span>
        </div>
        <NavbarNotification />
      </motion.div>

      {/* Menu */}
      <ul className="flex flex-col gap-4 py-2 w-full px-4 flex-1">
        {menu.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link to={item.lien} key={item.id}>
              <motion.li
                custom={index}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 cursor-pointer transition-colors py-1 hover:text-blue-500"
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-semibold">{item.nom}</span>
              </motion.li>
            </Link>
          );
        })}

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="border border-gray-300 my-2"
        />

        {/* Paramètres avec badge */}
        <Link to="/admin/parametre">
          <motion.div
            custom={menu.length}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            whileHover={{ x: 5 }}
            className="flex items-center gap-3 text-sm font-semibold cursor-pointer transition-colors hover:text-blue-500"
          >
            <Settings className="w-5 h-5" />
            <span>Paramètres</span>
           
          </motion.div>
        </Link>

        {/* Déconnexion */}
        <motion.div
          custom={menu.length + 1}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          whileHover={{ x: 5 }}
          onClick={handleLogout}
          className="flex items-center gap-3 text-sm font-semibold cursor-pointer text-red-600 hover:text-red-800"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </motion.div>
      </ul>

      {/* Profil */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4, ease: 'backOut' }}
        className="flex flex-row bg-gray-100 border border-gray-300 p-3 rounded-2xl gap-3 mt-auto mx-4 w-full max-w-[90%]"
      >
        <div className="relative">
          <img
            src={profil}
            alt="profil"
            className="w-14 h-14 rounded-full object-cover border border-white shadow-lg"
          />
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, duration: 0.2 }}
            className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase">
            {user ? `${user.prenom} ${user.nom}` : 'Chargement...'}
          </p>
          <p className="text-xs text-gray-700">
            {user?.role === 'admin' ? 'Administrateur' : 'Manager'}
          </p>
        </div>
      </motion.div>
    </motion.nav>
  );
}