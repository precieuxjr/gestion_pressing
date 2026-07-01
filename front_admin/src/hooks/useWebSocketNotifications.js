import { useEffect } from 'react';
import { socket } from '../services/socket';
import { useNotifications } from '../context/NotificationContext';

export const useWebSocketNotifications = () => {
  console.log('✅ Hook useWebSocketNotifications activé (admin)');
  const { addNotification } = useNotifications();

  useEffect(() => {
    console.log('🔄 useEffect du hook admin exécuté – attachement des écouteurs');

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
          message = `Un livreur a été assigné à la commande #${data.commandeId}`;
          type = 'success';
          // ✅ Redirection vers le détail de la commande
          link = `/admin/commandes/${data.commandeId}`;
          break;

        case 'statut_livraison_change':
          title = '📦 Avancement livraison';
          message = `Statut de livraison mis à jour : "${data.newStatutLivraison}"`;
          type = 'warning';
          // ✅ Redirection vers le détail de la commande
          link = `/admin/commandes/${data.commandeId}`;
          break;

        case 'assignation_annulee':
          title = '❌ Assignation annulée';
          message = `L'assignation du livreur a été annulée pour la commande #${data.commandeId}`;
          type = 'error';
          // ✅ Redirection vers le détail de la commande
          link = `/admin/commandes/${data.commandeId}`;
          break;

        case 'commande_deleted':
          title = '🗑️ Commande supprimée';
          message = `La commande #${data.commandeId} a été supprimée`;
          type = 'error';
          link = `/admin/commandes`; // page liste car détail inexistant
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

        case 'commande_creee':
          title = '✅ Commande créée';
          message = `Votre commande a été créée avec succès. En attente de validation.`;
          type = 'success';
          link = `/admin/commandes/${data.commandeId}`;
          break;

        case 'paiement_initie':
          title = '💳 Paiement initié';
          message = `Un paiement a été initié pour la commande #${data.commandeId}`;
          type = 'info';
          link = `/admin/commandes/${data.commandeId}`;
          break;

        case 'paiement_cree':
          title = '✅ Paiement enregistré';
          message = `Votre paiement a été enregistré avec succès.`;
          type = 'success';
          link = `/admin/commandes/${data.commandeId}`;
          break;

        case 'commande_payee':
          title = '💰 Commande payée';
          message = `La commande #${data.commandeId} a été marquée comme payée.`;
          type = 'success';
          link = `/admin/commandes/${data.commandeId}`;
          break;

        case 'profil_updated':
          title = '👤 Profil mis à jour';
          message = `Votre profil a été modifié avec succès.`;
          type = 'info';
          link = `/admin/clients`; // redirection vers la liste des clients (ou profil)
          break;

        case 'password_changed':
          title = '🔑 Mot de passe modifié';
          message = `Votre mot de passe a été mis à jour.`;
          type = 'info';
          link = `/admin/parametres`; // redirection vers paramètres
          break;

        case 'client_updated':
          title = '👤 Client mis à jour';
          message = `Les informations d'un client ont été modifiées.`;
          type = 'info';
          link = `/admin/clients`;
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

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('commande_updated', handleCommandeUpdate);

    console.log('✅ Écouteurs attachés avec succès');

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('commande_updated', handleCommandeUpdate);
      console.log('🧹 Écouteurs retirés');
    };
  }, [addNotification]);
};