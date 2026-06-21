import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { login } from '../../services/authService';
import { Mail, Lock, AlertCircle, Loader2, Shirt } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showCreate = searchParams.get('create') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);

      // Stocker les données
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Rediriger selon le rôle
      const role = data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'livreur') navigate('/livreur/dashboard');
      else if (role === 'client') navigate('/client/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 dark:bg-slate-950 px-4 transition-colors duration-300 antialiased font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none">
        
        {/* LOGO & EN-TÊTE */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl items-center justify-center mb-4 shadow-xs">
            <Shirt className="w-6 h-6 stroke-[2]" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Ravi de vous revoir
          </h1>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1">
            Connectez-vous à votre espace Smart Pressing
          </p>
        </div>

        {/* ALERTE D'ERREUR HAUTE FIDÉLITÉ */}
        {error && (
          <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm p-4 rounded-xl mb-6 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{error}</span>
          </div>
        )}

        {/* FORMULAIRE DE CONNEXION */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* CHAMP EMAIL */}
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Adresse email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* CHAMP MOT DE PASSE */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Mot de passe
              </label>
              <Link 
                to="/forgot-password" 
                className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Oublié ?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* BOUTON SOUMISSION ACTIONS */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
              loading 
                ? 'bg-blue-600/50 dark:bg-blue-500/50 text-white cursor-not-allowed' 
                : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white shadow-lg shadow-blue-500/10 transform hover:-translate-y-0.5 cursor-pointer'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Identification en cours...</span>
              </>
            ) : (
              <span>Se connecter</span>
            )}
          </button>
        </form>

        {/* LIEN DE CRÉATION DE COMPTE */}
        {showCreate && (
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Nouveau sur la plateforme ?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}