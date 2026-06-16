import { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Save,
  Camera,
  Moon,
  Sun,
  Mail,
  Smartphone,
  MapPin
} from 'lucide-react';

export default function LivreurParametres() {
  // États pour les champs du profil
  const [nom, setNom] = useState('Jean Livreur');
  const [email, setEmail] = useState('jean.livreur@smartpressing.cd');
  const [telephone, setTelephone] = useState('+243 812 345 678');
  const [adresse, setAdresse] = useState('12 Av. des Livreurs, Kinshasa');

  // États pour les préférences
  const [theme, setTheme] = useState('clair');
  const [langue, setLangue] = useState('fr');

  // États pour les notifications
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifApp, setNotifApp] = useState(true);

  // États pour la sécurité
  const [ancienMdp, setAncienMdp] = useState('');
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [confirmerMdp, setConfirmerMdp] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Logique de sauvegarde (API)
    alert('Profil mis à jour avec succès !');
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (nouveauMdp !== confirmerMdp) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    // Logique de changement de mot de passe
    alert('Mot de passe modifié avec succès !');
    setAncienMdp('');
    setNouveauMdp('');
    setConfirmerMdp('');
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Paramètres</h1>
        <p className="text-gray-500">Gérez vos informations personnelles et vos préférences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profil (carte principale) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section Profil */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <User size={24} className="text-emerald-500" />
              <h2 className="text-xl font-semibold text-gray-800">Mon profil</h2>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison par défaut</label>
                  <input
                    type="text"
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Save size={18} />
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>

          {/* Section Sécurité */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={24} className="text-emerald-500" />
              <h2 className="text-xl font-semibold text-gray-800">Sécurité</h2>
            </div>

            <form onSubmit={handleSavePassword}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                  <input
                    type="password"
                    value={ancienMdp}
                    onChange={(e) => setAncienMdp(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={nouveauMdp}
                    onChange={(e) => setNouveauMdp(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    value={confirmerMdp}
                    onChange={(e) => setConfirmerMdp(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Shield size={18} />
                  Changer le mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Colonne de droite : préférences et notifications */}
        <div className="space-y-6">
          {/* Préférences */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Globe size={24} className="text-emerald-500" />
              <h2 className="text-xl font-semibold text-gray-800">Préférences</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thème</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('clair')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      theme === 'clair'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Sun size={16} />
                    Clair
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('sombre')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      theme === 'sombre'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Moon size={16} />
                    Sombre
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                <select
                  value={langue}
                  onChange={(e) => setLangue(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="ln">Lingala</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Bell size={24} className="text-emerald-500" />
              <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-700">Par email</span>
                </div>
                <button
                  onClick={() => setNotifEmail(!notifEmail)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifEmail ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifEmail ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-700">Par SMS</span>
                </div>
                <button
                  onClick={() => setNotifSms(!notifSms)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifSms ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifSms ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-700">Notifications push</span>
                </div>
                <button
                  onClick={() => setNotifApp(!notifApp)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifApp ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifApp ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Carte supplémentaire : localisation */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={24} className="text-emerald-500" />
              <h2 className="text-xl font-semibold text-gray-800">Localisation</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Activez le partage de position pour optimiser vos tournées.
            </p>
            <button className="w-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Mettre à jour ma position
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}