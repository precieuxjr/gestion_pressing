// src/hooks/useWebSocketNotificationsLivreur.js
import { useEffect } from 'react';
import { socket } from '../services/socket';
import { useNotifications } from '../context/NotificationContext';

export const useWebSocketNotificationsLivreur = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    const handleCommandeUpdate = (data) => {
      console.log('📢 Événement reçu (livreur) :', data);

      let title = '';
      let message = '';
      let type = 'info';
      let link = null;

      switch (data.type) {
        case 'livreur_assigne':
          title = '🚚 Nouvelle commande assignée';
          message = `Commande #${data.commandeId} vous a été assignée.`;
          type = 'success';
          link = `/livreur/commandes/${data.commandeId}`;
          break;
        case 'statut_livraison_change':
          title = '📦 Statut de livraison modifié';
          message = `La commande #${data.commandeId} est maintenant "${data.newStatutLivraison}".`;
          type = 'warning';
          link = `/livreur/commandes/${data.commandeId}`;
          break;
        case 'assignation_annulee':
          title = '❌ Assignation annulée';
          message = `L'assignation de la commande #${data.commandeId} a été annulée.`;
          type = 'error';
          link = `/livreur/commandes/${data.commandeId}`;
          break;
        case 'status_changed':
          title = '📊 Statut de commande modifié';
          message = `La commande #${data.commandeId} est maintenant "${data.newStatus}".`;
          type = 'info';
          link = `/livreur/commandes/${data.commandeId}`;
          break;
        default:
          title = '🔄 Mise à jour';
          message = 'Une modification a été effectuée sur une commande.';
          type = 'info';
          link = '/livreur/commandes';
      }

      if (title) {
        addNotification({ type, title, message, link, data });
      }
    };

    socket.on('commande_updated', handleCommandeUpdate);
    console.log('✅ Écouteurs WebSocket livreur activés');

    return () => {
      socket.off('commande_updated', handleCommandeUpdate);
      console.log('🧹 Écouteurs WebSocket livreur retirés');
    };
  }, [addNotification]);
};