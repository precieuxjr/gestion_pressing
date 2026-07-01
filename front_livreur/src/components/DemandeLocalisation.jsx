import { MapPin, X, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DemandeLocalisation({ onAccept, onDecline, isVisible }) {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 max-w-md mx-auto"
      >
        {/* Icône et titre */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Partager votre position</h3>
            <p className="text-sm text-gray-500">Permettez à Smart Pressing de vous localiser</p>
          </div>
        </div>

        {/* Explication */}
        <div className="space-y-3 text-sm text-gray-600 bg-gray-50 rounded-xl p-4 mb-5">
          <p className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            Optimisez vos tournées avec des itinéraires intelligents.
          </p>
          <p className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            Recevez des commandes proches de vous en priorité.
          </p>
          <p className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            Votre position est sécurisée et utilisée uniquement pour vos livraisons.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAccept}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
          >
            <Navigation className="w-5 h-5" />
            Activer ma position
          </button>
          <button
            onClick={onDecline}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Plus tard
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}