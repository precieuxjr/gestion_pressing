import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    postnom: '', 
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    adresse: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔍 Mot de passe :', formData.password);
    console.log('🔍 Confirmation :', formData.confirmPassword);
  
    setError('');
    setLoading(true);

    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password,
        adresse: formData.adresse,
        role: 'client' // rôle par défaut
      };
      await register(userData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-green-500 text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Inscription réussie !</h2>
          <p className="text-gray-600">Vous allez être redirigé vers la page de connexion.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Créer un compte</h1>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <input
            name="nom"
            type="text"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            name="prenom"
            type="text"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
  name="postnom"
  type="text"
  placeholder="Postnom (facultatif)"
  value={formData.postnom || ''}
  onChange={handleChange}
  className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
/>
        </div>
        <input
          name="email"
          type="email"
          placeholder="Adresse email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
        <input
          name="telephone"
          type="tel"
          placeholder="Téléphone"
          value={formData.telephone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          name="adresse"
          type="text"
          placeholder="Adresse"
          value={formData.adresse}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmer le mot de passe"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg mt-4 transition disabled:opacity-50"
        >
          {loading ? 'Inscription en cours...' : "S'inscrire"}
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}