import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, User, Mail, Phone, Lock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

export default function InscriptionPro() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    postnom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    adresse: '',
    ville: '',
    codePostal: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Appel à l'API d'inscription
      await authService.register({
        nom: formData.nom,
        prenom: formData.prenom,
        postnom: formData.postnom,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password,
        adresse: `${formData.adresse}, ${formData.ville} ${formData.codePostal}`,
        role: 'client',
      });
      toast.success('Inscription réussie !');
      // Redirection ou reset
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Indicateurs de progression
  const steps = [
    { id: 1, label: 'Identité' },
    { id: 2, label: 'Sécurité' },
    { id: 3, label: 'Coordonnées' },
  ];

  const isFirstStep = step === 1;
  const isLastStep = step === steps.length;

  // Contenu des étapes
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Postnom</label>
                <input
                  type="text"
                  name="postnom"
                  value={formData.postnom}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre postnom (facultatif)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="exemple@email.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Téléphone *</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+243 812 345 678"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mot de passe *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <div className="md:col-span-2 text-sm text-gray-500">
                <Lock className="inline w-4 h-4 mr-1" />
                Le mot de passe doit comporter au moins 8 caractères.
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rue, numéro, quartier"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ville</label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kinshasa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Code postal</label>
                <input
                  type="text"
                  name="codePostal"
                  value={formData.codePostal}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1000"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="terms" required className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                J’accepte les <a href="#" className="text-blue-600 hover:underline">conditions générales</a> et la <a href="#" className="text-blue-600 hover:underline">politique de confidentialité</a>.
              </label>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold">Création de compte professionnel</h1>
          <p className="text-blue-100 text-sm mt-1">Remplissez les informations pour rejoindre Smart Pressing.</p>
        </div>

        {/* Indicateurs de progression */}
        <div className="px-8 pt-6 pb-2 flex justify-between">
          {steps.map((s) => (
            <div key={s.id} className="flex-1 text-center">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-semibold ${
                  s.id < step
                    ? 'bg-green-500 text-white'
                    : s.id === step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s.id < step ? <Check className="w-4 h-4" /> : s.id}
              </div>
              <span className="text-xs text-gray-500 mt-1 block">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="px-8 py-6">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              disabled={isFirstStep}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isFirstStep ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </button>

            {!isLastStep ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-md"
              >
                Continuer
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition shadow-md disabled:opacity-50"
              >
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}