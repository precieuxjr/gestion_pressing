import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Truck,
  User,
  LogOut,
  Settings,
  Menu,
  X
} from 'lucide-react';
import NavbarNotification from './NavbarNotification';

export default function NavLivreur() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Erreur parsing user', e);
      }
    }
  }, []);

  // Fermer le menu automatiquement lors d'un changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token_livreur');
    localStorage.removeItem('user');
    navigate('/livreur/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Bouton hamburger (visible uniquement sur mobile) */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
      >
        {isOpen ? <X size={24} className="text-gray-700 dark:text-gray-300" /> : <Menu size={24} className="text-gray-700 dark:text-gray-300" />}
      </button>

      {/* Overlay (visible uniquement sur mobile quand le menu est ouvert) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Barre de navigation latérale */}
      <nav
        className={`fixed top-0 left-0 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-64 transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo / Brand */}
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg md:text-xl font-bold flex-shrink-0">
              S
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-black text-gray-800 dark:text-white leading-none">
                SMART
              </h1>
              <p className="text-[10px] md:text-xs font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide">
                LIVREUR
              </p>
            </div>
            <div className="ml-auto">
              <NavbarNotification />
            </div>
          </div>
        </div>

        {/* Liens principaux */}
        <div className="flex-1 overflow-y-auto py-4 md:py-6 px-3 md:px-4 space-y-1">
          <NavLink
            to="/livreur/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <LayoutDashboard size={20} className="flex-shrink-0" />
            <span className="truncate">Tableau de bord</span>
          </NavLink>

          <NavLink
            to="/livreur/commandes"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <Package size={20} className="flex-shrink-0" />
            <span className="truncate">Mes commandes</span>
          </NavLink>

          <NavLink
            to="/livreur/livraisons"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <Truck size={20} className="flex-shrink-0" />
            <span className="truncate">Livraisons</span>
          </NavLink>

          <NavLink
            to="/livreur/profil"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <User size={20} className="flex-shrink-0" />
            <span className="truncate">Mon profil</span>
          </NavLink>

          <NavLink
            to="/livreur/parametres"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <Settings size={20} className="flex-shrink-0" />
            <span className="truncate">Paramètres</span>
          </NavLink>
        </div>

        {/* Profil du livreur */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 mb-3 transition-colors">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm flex-shrink-0">
              {user ? `${user.prenom?.charAt(0) || ''}${user.nom?.charAt(0) || ''}` : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                {user ? `${user.prenom || ''} ${user.nom || ''}` : 'Chargement...'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.role === 'livreur' ? 'Livreur' : 'Utilisateur'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 md:py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>
    </>
  );
}