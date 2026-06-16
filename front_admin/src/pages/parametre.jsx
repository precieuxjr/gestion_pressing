import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircle,
  Lock,
  Building2,
  Bell,
  Palette,
  Globe,
  Save,
  Loader2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Sun,
  Moon,
  AlertCircle
} from 'lucide-react';
import NotificationIcon from '../components/notifiocations';
import NavBarHorizontal from '../components/navbar_horizontal';

export default function Parametres() {
  const [activeTab, setActiveTab] = useState('profil');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // État du profil
  const [profil, setProfil] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: ''
  });

  // État du mot de passe
  const [passwordData, setPasswordData] = useState({
    ancien: '',
    nouveau: '',
    confirmation: ''
  });

  // État des paramètres généraux
  const [general, setGeneral] = useState({
    nom_entreprise: 'Smart Pressing',
    devise: 'FCFA',
    email_contact: 'contact@smartpressing.cd',
    telephone_contact: '+243 123 456 789',
    adresse_entreprise: 'Kinshasa, RDC',
    logo_url: '/logo-placeholder.png'
  });

  // État des notifications
  const [notifications, setNotifications] = useState({
    alertes_commandes: true,
    alertes_livraisons: true,
    alertes_paiements: true,
    emails_notifications: true,
    newsletter: false
  });

  // État d'affichage
  const [affichage, setAffichage] = useState({
    theme: 'clair', // 'clair' | 'sombre'
    langue: 'fr'
  });

  // Récupérer les données au chargement
  useEffect(() => {
    // Ici, vous feriez un appel API pour charger les données actuelles
    // Exemple : fetch('/api/parametres').then(...)
    console.log('Chargement des paramètres...');
  }, []);

  const handleProfilChange = (e) => {
    setProfil({ ...profil, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleGeneralChange = (e) => {
    setGeneral({ ...general, [e.target.name]: e.target.value });
  };

  const handleNotificationToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleAffichageChange = (key, value) => {
    setAffichage({ ...affichage, [key]: value });
  };

  const saveSettings = async (section) => {
    setLoading(true);
    setMessage(null);
    try {
      // Ici, vous feriez un appel API pour sauvegarder la section
      // Exemple : await fetch(`/api/parametres/${section}`, { method: 'POST', body: JSON.stringify(data) })
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès !' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde.' });
    } finally {
      setLoading(false);
    }
  };

  // Onglets
  const tabs = [
    { id: 'profil', label: 'Profil', icon: UserCircle },
    { id: 'general', label: 'Général', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'affichage', label: 'Affichage', icon: Palette }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col bg-gray-50 min-h-screen w-250"
    >
      <NavBarHorizontal
        buttonLabel=""
        onButtonClick={() => {}}
        onSearch={() => {}}
        placeholder=""
      />

      <div className="p-6">
        <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-6">
          Paramètres
        </motion.h1>

        {/* Message de confirmation */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.type === 'success' ? '✅' : '❌'}
            {message.text}
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar des onglets */}
          <motion.div variants={itemVariants} className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Contenu */}
          <motion.div variants={itemVariants} className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {activeTab === 'profil' && (
                <ProfilForm
                  profil={profil}
                  passwordData={passwordData}
                  onProfilChange={handleProfilChange}
                  onPasswordChange={handlePasswordChange}
                  onSave={() => saveSettings('profil')}
                  loading={loading}
                />
              )}

              {activeTab === 'general' && (
                <GeneralForm
                  general={general}
                  onChange={handleGeneralChange}
                  onSave={() => saveSettings('general')}
                  loading={loading}
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationsForm
                  notifications={notifications}
                  onToggle={handleNotificationToggle}
                  onSave={() => saveSettings('notifications')}
                  loading={loading}
                />
              )}

              {activeTab === 'affichage' && (
                <AffichageForm
                  affichage={affichage}
                  onChange={handleAffichageChange}
                  onSave={() => saveSettings('affichage')}
                  loading={loading}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

// ----- Sous-composants -----

function ProfilForm({ profil, passwordData, onProfilChange, onPasswordChange, onSave, loading }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <UserCircle className="w-5 h-5 text-blue-500" />
        Mon profil
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            name="nom"
            value={profil.nom}
            onChange={onProfilChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
          <input
            type="text"
            name="prenom"
            value={profil.prenom}
            onChange={onProfilChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative"><label className="block text-sm font-medium text-gray-700 mb-1">Adresse mail</label>
  <Mail className="absolute left-3 top-11 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
  <input
    type="email"
    name="email"
    value={profil.email}
    onChange={onProfilChange}
    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      profil.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profil.email)
        ? 'border-red-500 focus:ring-red-500'
        : ''
    }`}
  />
</div>
        <div className='relative'>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <Phone className="absolute left-3 top-11 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            name="telephone"
            value={profil.telephone}
            onChange={onProfilChange}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <textarea
            name="adresse"
            rows="2"
            value={profil.adresse}
            onChange={onProfilChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-gray-500" />
          Changer le mot de passe
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label>
            <input
              type="password"
              name="ancien"
              value={passwordData.ancien}
              onChange={onPasswordChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              name="nouveau"
              value={passwordData.nouveau}
              onChange={onPasswordChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation</label>
            <input
              type="password"
              name="confirmation"
              value={passwordData.confirmation}
              onChange={onPasswordChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        <Save className="w-4 h-4" />
        Enregistrer
      </button>
    </div>
  );
}

function GeneralForm({ general, onChange, onSave, loading }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-500" />
        Paramètres généraux
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
          <input
            type="text"
            name="nom_entreprise"
            value={general.nom_entreprise}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
          <select
            name="devise"
            value={general.devise}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="FCFA">FCFA</option>
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar ($)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email de contact</label>
          <input
            type="email"
            name="email_contact"
            value={general.email_contact}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="text"
            name="telephone_contact"
            value={general.telephone_contact}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input
            type="text"
            name="adresse_entreprise"
            value={general.adresse_entreprise}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
          <input
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        <Save className="w-4 h-4" />
        Enregistrer
      </button>
    </div>
  );
}

function NotificationsForm({ notifications, onToggle, onSave, loading }) {
  const items = [
    { key: 'alertes_commandes', label: 'Nouvelles commandes', desc: 'Recevoir une alerte pour chaque nouvelle commande' },
    { key: 'alertes_livraisons', label: 'Livraisons en cours', desc: 'Suivi des livraisons en temps réel' },
    { key: 'alertes_paiements', label: 'Paiements reçus', desc: 'Alerte lors d\'un paiement validé' },
    { key: 'emails_notifications', label: 'Notifications par email', desc: 'Recevoir les alertes par email' },
    { key: 'newsletter', label: 'Newsletter', desc: 'Recevoir les actualités du pressing' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <Bell className="w-5 h-5 text-blue-500" />
        Notifications
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-800">{item.label}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <button
              onClick={() => onToggle(item.key)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications[item.key] ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications[item.key] ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onSave}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        <Save className="w-4 h-4" />
        Enregistrer
      </button>
    </div>
  );
}

function AffichageForm({ affichage, onChange, onSave, loading }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <Palette className="w-5 h-5 text-blue-500" />
        Personnalisation
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thème */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <label className="block text-sm font-medium text-gray-700 mb-3">Thème</label>
          <div className="flex gap-3">
            <button
              onClick={() => onChange('theme', 'clair')}
              className={`flex-1 flex items-center gap-2 justify-center px-4 py-3 rounded-lg border-2 transition ${
                affichage.theme === 'clair'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Sun className="w-5 h-5" />
              Clair
            </button>
            <button
              onClick={() => onChange('theme', 'sombre')}
              className={`flex-1 flex items-center gap-2 justify-center px-4 py-3 rounded-lg border-2 transition ${
                affichage.theme === 'sombre'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Moon className="w-5 h-5" />
              Sombre
            </button>
          </div>
        </div>

        {/* Langue */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <label className="block text-sm font-medium text-gray-700 mb-3">Langue</label>
          <div className="flex gap-3">
            <button
              onClick={() => onChange('langue', 'fr')}
              className={`flex-1 flex items-center gap-2 justify-center px-4 py-3 rounded-lg border-2 transition ${
                affichage.langue === 'fr'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Globe className="w-5 h-5" />
              Français
            </button>
            <button
              onClick={() => onChange('langue', 'en')}
              className={`flex-1 flex items-center gap-2 justify-center px-4 py-3 rounded-lg border-2 transition ${
                affichage.langue === 'en'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Globe className="w-5 h-5" />
              English
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        <Save className="w-4 h-4" />
        Enregistrer
      </button>
    </div>
  );
}