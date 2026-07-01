import { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  Key,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getProfil, updateProfil, changePassword } from '../services/livreurService';

export default function LivreurParametres() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    nom: '',
    prenom: '',
    postnom: '',
    email: '',
    telephone: '',
    adresse: '',
  });

  const [ancienMdp, setAncienMdp] = useState('');
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [confirmerMdp, setConfirmerMdp] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const data = await getProfil();
        setProfile({
          nom: data.nom || '',
          prenom: data.prenom || '',
          postnom: data.postnom || '',
          email: data.email || '',
          telephone: data.telephone || '',
          adresse: data.adresse || '',
        });
      } catch (error) {
        toast.error('Impossible de charger votre profil', {
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfil();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfil({
        nom: profile.nom,
        prenom: profile.prenom,
        postnom: profile.postnom,
        email: profile.email,
        telephone: profile.telephone,
        adresse: profile.adresse,
      });
      toast.success('Profil mis à jour avec succès !', {
        icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
        duration: 4000,
      });
      const updated = await getProfil();
      setProfile({
        nom: updated.nom || '',
        prenom: updated.prenom || '',
        postnom: updated.postnom || '',
        email: updated.email || '',
        telephone: updated.telephone || '',
        adresse: updated.adresse || '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour', {
        icon: <XCircle className="w-5 h-5 text-red-500" />,
        duration: 6000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (nouveauMdp !== confirmerMdp) {
      toast.error('Les mots de passe ne correspondent pas', {
        icon: <Lock className="w-5 h-5 text-red-500" />,
        duration: 4000,
      });
      return;
    }
    if (nouveauMdp.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères', {
        icon: <Key className="w-5 h-5 text-red-500" />,
        duration: 4000,
      });
      return;
    }
    if (ancienMdp === nouveauMdp) {
      toast.error('Le nouveau mot de passe doit être différent de l\'ancien', {
        icon: <Lock className="w-5 h-5 text-red-500" />,
        duration: 4000,
      });
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(ancienMdp, nouveauMdp);
      toast.success('Mot de passe modifié avec succès !', {
        icon: <Lock className="w-5 h-5 text-emerald-600" />,
        duration: 5000,
      });
      setAncienMdp('');
      setNouveauMdp('');
      setConfirmerMdp('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors du changement', {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        duration: 6000,
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f7fb] dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement du profil...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] dark:bg-gray-900 p-4 md:p-6">
      {/* En-tête */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Paramètres</h1>
        <p className="text-gray-500 dark:text-gray-400">Gérez vos informations personnelles et votre sécurité.</p>
      </div>

      {/* Conteneur principal – pleine largeur */}
      <div className="w-full space-y-6">
        {/* === Section Profil === */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <User size={24} className="text-emerald-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Mon profil</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* 1ère ligne : Nom + Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                <input
                  type="text"
                  value={profile.nom}
                  onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                <input
                  type="text"
                  value={profile.prenom}
                  onChange={(e) => setProfile({ ...profile, prenom: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Postnom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postnom (facultatif)</label>
              <input
                type="text"
                value={profile.postnom}
                onChange={(e) => setProfile({ ...profile, postnom: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
            </div>

            {/* 2e ligne : Email + Téléphone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={profile.telephone}
                  onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Adresse (pleine largeur) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse de livraison par défaut</label>
              <input
                type="text"
                value={profile.adresse}
                onChange={(e) => setProfile({ ...profile, adresse: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>

        {/* === Section Sécurité === */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={24} className="text-emerald-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Sécurité</h2>
          </div>

          <form onSubmit={handleSavePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe actuel</label>
              <input
                type="password"
                value={ancienMdp}
                onChange={(e) => setAncienMdp(e.target.value)}
                autoComplete="new-password"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={nouveauMdp}
                  onChange={(e) => setNouveauMdp(e.target.value)}
                  autoComplete="new-password"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmation</label>
                <input
                  type="password"
                  value={confirmerMdp}
                  onChange={(e) => setConfirmerMdp(e.target.value)}
                  autoComplete="new-password"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={changingPassword}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield size={18} />}
                {changingPassword ? 'Changement...' : 'Changer le mot de passe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}