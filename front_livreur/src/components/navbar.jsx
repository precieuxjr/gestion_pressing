import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  User, 
  LogOut,
  Settings 
} from 'lucide-react';

export default function NavLivreur() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/livreur/login');
  };

  return (
    <nav className="w-72 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col shadow-sm">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl font-bold">
            S
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-800 leading-none">SMART</h1>
            <p className="text-xs font-semibold text-emerald-600 tracking-wide">LIVREUR</p>
          </div>
        </div>
      </div>

      {/* Liens principaux */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <NavLink
          to="/livreur/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <LayoutDashboard size={20} />
          Tableau de bord
        </NavLink>

        <NavLink
          to="/livreur/commandes"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Package size={20} />
          Mes commandes
        </NavLink>

        <NavLink
          to="/livreur/livraisons"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Truck size={20} />
          Livraisons 
        </NavLink>

        <NavLink
          to="/livreur/profil"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <User size={20} />
          Mon profil
        </NavLink>

        <NavLink
          to="/livreur/parametres"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Settings size={20} />
          Paramètres
        </NavLink>
      </div>

      {/* Profil du livreur */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 mb-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
            {user ? `${user.prenom?.charAt(0)}${user.nom?.charAt(0)}` : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {user ? `${user.prenom} ${user.nom}` : 'Chargement...'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role === 'livreur' ? 'Livreur' : 'Utilisateur'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </nav>
  );
}