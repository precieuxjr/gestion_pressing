// src/components/ErrorFallback.jsx
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorFallback({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  const handleReset = () => {
    resetErrorBoundary(); // Réinitialise l'erreur
    navigate('/');        // Redirige vers l'accueil (ou recharger la page)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Oups ! Une erreur est survenue
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          L'application a rencontré un problème inattendu.
          {error && (
            <span className="block mt-2 p-2 bg-red-50 text-red-600 rounded-lg text-xs font-mono">
              {error.message}
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl shadow-md transition"
          >
            <RefreshCw size={18} />
            Réessayer
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition"
          >
            <Home size={18} />
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
}