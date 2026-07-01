// src/pages/parametre.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircle,
  Lock,
  Save,
  Loader2,
  Key,
  AlertCircle,
} from 'lucide-react';
import NavBarHorizontal from '../components/navbar_horizontal';
import toast from 'react-hot-toast';
import {
  getProfil,
  updateProfil,
  changePassword,
} from '../services/parametresService';

export default function Parametres() {
  const [activeTab, setActiveTab] = useState('profil');
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // État du profil
  const [profil, setProfil] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
  });

  // État du mot de passe
  const [passwordData, setPasswordData] = useState({
    ancien: '',
    nouveau: '',
    confirmation: '',
  });

  // Chargement initial
  useEffect(() => {
    const loadProfil = async () => {
      setLoadingInitial(true);
      try {
        const data = await getProfil();
        setProfil({
          nom: data.nom || '',
          prenom: data.prenom || '',
          email: data.email || '',
          telephone: data.telephone || '',
          adresse: data.adresse || '',
        });
      } catch (err) {
        console.error('Erreur chargement profil:', err);
        toast.error('Erreur lors du chargement du profil');
      } finally {
        setLoadingInitial(false);
      }
    };
    loadProfil();
  }, []);

  // Handlers
  const handleProfilChange = (e) => {
    setProfil({ ...profil, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Sauvegarde globale (profil + mot de passe)
  const saveProfil = async () => {
    setLoading(true);
    try {
      // 1. Mise à jour du profil
      await updateProfil({
        nom: profil.nom,
        prenom: profil.prenom,
        email: profil.email,
        telephone: profil.telephone,
        adresse: profil.adresse,
      });

      // 2. Si des champs mot de passe sont remplis, on procède au changement
      const { ancien, nouveau, confirmation } = passwordData;
      if (nouveau || confirmation || ancien) {
        // Vérifications
        if (!ancien.trim()) {
          toast.error('Veuillez entrer votre mot de passe actuel', {
            icon: <Lock className="w-5 h-5 text-red-500" />,
            duration: 4000,
          });
          return;
        }
        if (nouveau !== confirmation) {
          toast.error('Les mots de passe ne correspondent pas', {
            icon: <Lock className="w-5 h-5 text-red-500" />,
            duration: 4000,
          });
          return;
        }
        if (nouveau.length < 6) {
          toast.error('Le mot de passe doit contenir au moins 6 caractères', {
            icon: <Key className="w-5 h-5 text-red-500" />,
            duration: 4000,
          });
          return;
        }
        if (ancien === nouveau) {
          toast.error('Le nouveau mot de passe doit être différent de l\'ancien', {
            icon: <Lock className="w-5 h-5 text-red-500" />,
            duration: 4000,
          });
          return;
        }

        // Appel API
        await changePassword(ancien, nouveau);
        toast.success('Mot de passe mis à jour', {
          icon: <Lock className="w-5 h-5 text-emerald-600" />,
          duration: 4000,
        });
        // Réinitialisation des champs
        setPasswordData({ ancien: '', nouveau: '', confirmation: '' });
      }

      toast.success('Profil mis à jour', {
        icon: <UserCircle className="w-5 h-5 text-emerald-600" />,
        duration: 4000,
      });
    } catch (err) {
      console.error('Erreur mise à jour:', err);
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour', {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [{ id: 'profil', label: 'Profil', icon: UserCircle }];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col bg-gray-50 dark:bg-gray-900 min-h-screen w-full"
    >
      <NavBarHorizontal buttonLabel="" onButtonClick={() => {}} onSearch={() => {}} placeholder="" />

      <div className="p-4 md:p-6">
        <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Paramètres
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <motion.div variants={itemVariants} className="lg:w-64 shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-blue-500" />
                  Mon profil
                </h2>

                {/* Profil */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                    <input
                      type="text"
                      name="nom"
                      value={profil.nom}
                      onChange={handleProfilChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      value={profil.prenom}
                      onChange={handleProfilChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse email</label>
                    <input
                      type="email"
                      name="email"
                      value={profil.email}
                      onChange={handleProfilChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={profil.telephone}
                      onChange={handleProfilChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse</label>
                    <textarea
                      name="adresse"
                      rows="2"
                      value={profil.adresse}
                      onChange={handleProfilChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-4">
                    <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    Changer le mot de passe
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ancien mot de passe</label>
                      <input
                        type="password"
                        name="ancien"
                        value={passwordData.ancien}

                        onChange={handlePasswordChange}
                        autoComplete="new-password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nouveau mot de passe</label>
                      <input
                        type="password"
                        name="nouveau"
                        value={passwordData.nouveau}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmation</label>
                      <input
                        type="password"
                        name="confirmation"
                        value={passwordData.confirmation}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Bouton */}
                <button
                  onClick={saveProfil}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}