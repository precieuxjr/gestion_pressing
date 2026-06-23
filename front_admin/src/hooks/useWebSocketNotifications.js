import { useEffect } from 'react';
import { socket } from '../services/socket';
import { useNotifications } from '../context/NotificationContext';

export const useWebSocketNotifications = () => {
  console.log('✅ Hook useWebSocketNotifications activé (admin)');
  const { addNotification } = useNotifications();

  useEffect(() => {
    console.log('🔄 useEffect du hook admin exécuté – attachement des écouteurs');

    // --- Handlers ---
    const handleConnect = () => {
      console.log('✅ Socket admin connecté (ID:', socket.id, ')');
    };

    const handleDisconnect = () => {
      console.log('❌ Socket admin déconnecté');
    };

    const handleCommandeUpdate = (data) => {
      console.log('📢 Événement reçu par admin :', data);

      let title = '';
      let message = '';
      let type = 'info';
      let link = null;

      switch (data.type) {
        case 'status_changed':
          title = '📊 Statut modifié';
          message = `La commande a changé de statut vers "${data.newStatus}"`;
          type = 'info';
          link = `/admin/commandes/${data.commandeId}`;
          break;

        case 'livreur_assigne':
          title = '🚚 Livreur assigné';
          message = `Un livreur a été assigné à une commande`;
          type = 'success';
          link = `/admin/livraisons`;
          break;

        case 'statut_livraison_change':
          title = '📦 Avancement livraison';
          message = `Statut de livraison mis à jour : "${data.newStatutLivraison}"`;
          type = 'warning';
          link = `/admin/livraisons`;
          break;

        case 'assignation_annulee':
          title = '❌ Assignation annulée';
          message = `L'assignation d'un livreur a été annulée`;
          type = 'error';
          link = `/admin/livraisons`;
          break;

        case 'commande_deleted':
          title = '🗑️ Commande supprimée';
          message = `Une commande a été supprimée`;
          type = 'error';
          link = `/admin/commandes`;
          break;

        case 'dates_changed':
          title = '📅 Dates modifiées';
          message = `Les dates de la commande ont été mises à jour`;
          type = 'info';
          link = `/admin/commandes/${data.commandeId}`;
          break;

        case 'nouvelle_commande':
          title = '📦 Nouvelle commande';
          message = `Une nouvelle commande a été créée par un client`;
          type = 'success';
          link = `/admin/commandes/${data.commandeId}`;
          break;

        default:
          title = '🔄 Mise à jour';
          message = `Une modification a été effectuée sur une commande`;
          type = 'info';
          link = null;
      }

      console.log(`🔔 Ajout de la notification : "${title}" – ${message}`);
      addNotification({
        type,
        title,
        message,
        link,
        data,
      });
    };

    // --- Attachement des écouteurs ---
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('commande_updated', handleCommandeUpdate);

    console.log('✅ Écouteurs attachés avec succès');

    // --- Nettoyage ---
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('commande_updated', handleCommandeUpdate);
      console.log('🧹 Écouteurs retirés');
    };
  }, [addNotification]);
};