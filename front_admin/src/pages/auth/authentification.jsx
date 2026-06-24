import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      if (data.user.role !== 'admin') {
        throw new Error("Accès refusé. Cet espace est réservé aux administrateurs.");
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      navigate('admin/dashboard');

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
        
        {/* LEFT SIDE - compact */}
        <div className="bg-linear-to-br from-blue-500 to-sky-400 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold border border-white/20">
                S
              </div>
              <div>
                <h1 className="text-2xl font-black leading-none">SMART</h1>
                <p className="font-semibold text-blue-100 tracking-wide text-xs">PRESSING</p>
              </div>
            </div>

            <div>
              <p className="uppercase tracking-[3px] text-blue-100 text-xs mb-3">Administration</p>
              <h2 className="text-3xl font-black leading-tight mb-4">Gérez votre pressing intelligemment.</h2>
              <p className="text-blue-100 text-sm leading-relaxed max-w-lg">
                Accédez au tableau de bord, aux commandes, aux clients et aux statistiques de votre entreprise depuis une seule plateforme moderne.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-3 mt-8">
            <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-xl p-3">
              <h3 className="text-2xl font-bold mb-1">250+</h3>
              <p className="text-xs text-blue-100">Clients actifs</p>
            </div>
            <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-xl p-3">
              <h3 className="text-2xl font-bold mb-1">32</h3>
              <p className="text-xs text-blue-100">Commandes / jour</p>
            </div>
            <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-xl p-3">
              <h3 className="text-2xl font-bold mb-1">98%</h3>
              <p className="text-xs text-blue-100">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - compact */}
        <div className="p-8 flex items-center justify-center bg-white">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <p className="text-blue-500 font-semibold mb-2 uppercase tracking-[2px] text-xs">Connexion sécurisée</p>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Espace administrateur</h2>
              <p className="text-gray-500 text-sm">Connectez-vous pour accéder au système de gestion Smart Pressing.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              
              {message && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                  {message}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@smartpressing.cd"
                  required
                  className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                />
              </div>

              <div className='relative'>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Mot de passe</label>
                  <button type="button" className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                    Mot de passe oublié ?
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                  <span className="text-gray-600 text-xs">Se souvenir de moi</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-12 rounded-xl text-white font-semibold text-base shadow-lg transition-all duration-300 ${
                  loading 
                    ? 'bg-blue-400 cursor-not-allowed shadow-none' 
                    : 'bg-blue-500 hover:bg-blue-600 shadow-blue-200'
                }`}
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <p>© 2026 Smart Pressing</p>
              <p>Administration sécurisée</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}