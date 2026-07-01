import { useState, useRef, useEffect } from 'react';
import { Bell, X, ChevronRight, User, MapPin, Calendar, DollarSign, Package, Truck,Loader2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { getCommandeDetails } from '../services/commandes'; // ← à adapter selon votre service
import toast from 'react-hot-toast';

export default function NavbarNotification() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeIcon = (type) => {
    const icons = { info: '🔵', success: '✅', warning: '⚠️', error: '❌' };
    return icons[type] || '🔵';
  };

  // ✅ Fonction pour afficher les détails de la commande
  const handleVoirCommande = async (notif) => {
    if (!notif.data?.commandeId) {
      toast.error('Identifiant de commande manquant');
      return;
    }

    // Marquer la notification comme lue
    markAsRead(notif.id);

    setLoadingDetails(true);
    setShowDetails(true);

    try {
      // 🔹 Appel API pour récupérer les détails complets
      const response = await getCommandeDetails(notif.data.commandeId);
      setSelectedCommande(response.data || response);
    } catch (error) {
      console.error('Erreur chargement détails:', error);
      toast.error('Impossible de charger les détails de la commande');
      setShowDetails(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Fermer le modal des détails
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedCommande(null);
  };

  return (
    <>
      {/* Dropdown des notifications (inchangé) */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute left-5 top-1 mt-2 w-70 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
              <h4 className="font-semibold text-gray-800 text-sm">Notifications</h4>
              {notifications.length > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-700">
                  Tout lire
                </button>
              )}
            </div>
            <div className="overflow-y-auto max-h-72">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  Aucune notification
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition ${
                      !notif.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{getTypeIcon(notif.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-800">{notif.title}</span>
                          {!notif.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notif.message}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-gray-400">
                            {new Date(notif.createdAt).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {/* ✅ Bouton "Voir" déclenche l'ouverture du modal */}
                          <button
                            onClick={() => handleVoirCommande(notif)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            Voir <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeNotification(notif.id)}
                        className="text-gray-300 hover:text-red-500 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-2 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-400">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''} • {notifications.length} au total
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================== */}
      {/* ✅ MODAL RÉCAPITULATIF DE LA COMMANDE */}
      {/* ======================================== */}
      {showDetails && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleCloseDetails}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermeture */}
            <button
              onClick={handleCloseDetails}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {loadingDetails ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Loader2 className="animate-spin w-8 h-8 mx-auto mb-2" />
                Chargement...
              </div>
            ) : selectedCommande ? (
              <>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 pr-8">
                  📦 Récapitulatif
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Package className="w-4 h-4" /> Commande
                    </span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                      {selectedCommande.reference || selectedCommande.id?.substring(0, 8)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <User className="w-4 h-4" /> Client
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
  {selectedCommande.client?.prenom} {selectedCommande.client?.nom}
</span>
                  </div>

                  <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> Adresse
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white text-right max-w-[60%] break-words">
                      {selectedCommande.adresse_livraison || selectedCommande.adresse_collecte || 'Non renseignée'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Truck className="w-4 h-4" /> Statut livraison
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {selectedCommande.statut_livraison || 'En attente'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Date
                    </span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {selectedCommande.depositDate ? new Date(selectedCommande.depositDate).toLocaleDateString('fr-FR') : '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> Montant
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {selectedCommande.amount ? `${selectedCommande.amount.toLocaleString()} FC` : '—'}
                    </span>
                  </div>

                  {selectedCommande.livreur_nom && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Livreur</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-white">{selectedCommande.livreur_nom}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <button
                    onClick={handleCloseDetails}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition"
                  >
                    Fermer
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Aucune information disponible
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}