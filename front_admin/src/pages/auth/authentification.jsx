import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export function AdminLoginPage() {
  const navigate = useNavigate(); 

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 1. Création des states pour stocker les champs et les messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Gestion de la soumission du formulaire (Logique Fetch React intégrée)
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

      // Vérification de sécurité : Seuls les admins ou les gestionnaires accèdent ici
      if (data.user.role !== 'admin') {
        throw new Error("Accès refusé. Cet espace est réservé aux administrateurs.");
      }

      // Succès : Stockage sécurisé du token et de l'utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirection fluide via le routeur de React
      navigate('/admin/dashboard');

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-2 border border-gray-100">
        
        {/* LEFT SIDE */}
        <div className="bg-gradient-to-br from-blue-500 to-sky-400 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-16">
              <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold border border-white/20">
                S
              </div>
              <div>
                <h1 className="text-3xl font-black leading-none">SMART</h1>
                <p className="font-semibold text-blue-100 tracking-wide">PRESSING</p>
              </div>
            </div>

            <div>
              <p className="uppercase tracking-[4px] text-blue-100 text-sm mb-5">Administration</p>
              <h2 className="text-5xl font-black leading-tight mb-6">Gérez votre pressing intelligemment.</h2>
              <p className="text-blue-100 text-lg leading-relaxed max-w-lg">
                Accédez au tableau de bord, aux commandes, aux clients et aux statistiques de votre entreprise depuis une seule plateforme moderne.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 mt-16">
            <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-5">
              <h3 className="text-3xl font-bold mb-2">250+</h3>
              <p className="text-sm text-blue-100">Clients actifs</p>
            </div>
            <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-5">
              <h3 className="text-3xl font-bold mb-2">32</h3>
              <p className="text-sm text-blue-100">Commandes / jour</p>
            </div>
            <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-5">
              <h3 className="text-3xl font-bold mb-2">98%</h3>
              <p className="text-sm text-blue-100">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-10 lg:p-14 flex items-center justify-center bg-white">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <p className="text-blue-500 font-semibold mb-3 uppercase tracking-[3px] text-sm">Connexion sécurisée</p>
              <h2 className="text-4xl font-black text-gray-900 mb-4">Espace administrateur</h2>
              <p className="text-gray-500 leading-relaxed">Connectez-vous pour accéder au système de gestion Smart Pressing.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Affichage dynamique des messages d'erreur */}
              {message && (
                <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                  {message}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Adresse email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@smartpressing.cd"
                  required
                  className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className='relative'>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">Mot de passe</label>
                  <button type="button" className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                    Mot de passe oublié ?
                  </button>
                </div>
                <input
                  type={showPassword ? 'text':'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-5 outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
                <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-4 bottom-4 text-gray-500 hover:text-gray-700 focus:outline-none text-sm"
        >
          {showPassword ? <Eye/> : <EyeOff/>}
        </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                  <span className="text-gray-600 text-sm">Se souvenir de moi</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-14 rounded-2xl text-white font-semibold text-lg shadow-lg transition-all duration-300 ${
                  loading 
                    ? 'bg-blue-400 cursor-not-allowed shadow-none' 
                    : 'bg-blue-500 hover:bg-blue-600 shadow-blue-200'
                }`}
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <p>© 2026 Smart Pressing</p>
              <p>Administration sécurisée</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}