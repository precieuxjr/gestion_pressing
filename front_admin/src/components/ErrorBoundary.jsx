// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état pour afficher l'interface de secours
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez logger l'erreur vers un service externe ici
    console.error("Erreur capturée par ErrorBoundary :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Interface de secours personnalisée
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900">Oups ! Une erreur est survenue</h2>
            <p className="text-gray-600 mt-2">
              Nous rencontrons un problème technique. Veuillez réessayer ou revenir plus tard.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Réessayer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;