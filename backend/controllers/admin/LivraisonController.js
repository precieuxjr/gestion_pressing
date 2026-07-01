import Commande from '../../models/commandes.js';
import User from '../../models/users.js';
import Notification from '../../models/Notification.js';
import db from '../../config/db.js';


export const getCommandesPayees = async (req, res) => {
  try {
    const commandes = await Commande.findAllWithLivraisonInfo('Payée');
    res.json(commandes);
  } catch (error) {
    console.error('❌ Erreur getCommandesPayees:', error);
    res.status(500).json({ error: error.message });
  }
};

export async function getCommandesLivraison(req, res) {
  try {
    const { statut } = req.query;
    const commandes = await Commande.findAllWithLivraisonInfo(statut);
    res.json(commandes);
  } catch (error) {
    console.error('❌ Erreur getCommandesLivraison:', error);
    res.status(500).json({ error: error.message });
  }
};

export async function getLivreursDisponibles(req, res) {
  try {
    const livreurs = await User.findAvailableLivreurs();
    res.json(livreurs);
  } catch (error) {
    console.error('❌ Erreur getLivreursDisponibles:', error);
    res.status(500).json({ error: error.message });
  }
};

export async function getAllLivreurs(req, res) {
  try {
    const livreurs = await User.findAllLivreurs();
    res.json(livreurs);
  } catch (error) {
    console.error('❌ Erreur getAllLivreurs:', error);
    res.status(500).json({ error: error.message });
  }
};
// =====================================================
export async function assignerLivreur(req, res) {
  try {
    const { publicId } = req.params;
    const { livreur_id } = req.body;

    if (!livreur_id) {
      return res.status(400).json({ error: 'livreur_id requis' });
    }

    const commande = await Commande.findByPublicId(publicId);
    if (!commande) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    if (commande.statut_livraison === 'Livrée') {
      return res.status(400).json({ error: 'Impossible d\'assigner une commande déjà livrée' });
    }

    if (!['Payée', 'Prêt'].includes(commande.statut)) {
      return res.status(400).json({
        error: 'La commande doit être payée ou prête pour être assignée à un livreur'
      });
    }

    const livreur = await User.findByPublicId(livreur_id);
    if (!livreur) {
      return res.status(404).json({ error: 'Livreur non trouvé' });
    }

    const activeCount = await Commande.countActiveForLivreur(livreur.public_id, true);
    if (activeCount >= 5) {
      return res.status(400).json({
        error: 'Ce livreur a déjà 5 commandes en cours. Maximum atteint.'
      });
    }

    if (livreur.disponibilite !== 'En livraison') {
      await User.updateDisponibilite(livreur.public_id, 'En livraison');
    }

    await commande.assignerLivreur(livreur.public_id);

    const newCount = await Commande.countActiveForLivreur(livreur.public_id, true);
    if (newCount === 5) {
      await User.updateDisponibilite(livreur.public_id, 'Indisponible');
    }

    const updated = await Commande.findByIdWithLivraison(publicId);

    // 1️⃣ Récupérer les parties prenantes
    const client = await User.findById(commande.user_id);
    const clientPublicId = client?.public_id || null;
    const livreurPublicId = livreur.public_id;

    // 2️⃣ Récupérer l'instance Socket.IO
    const io = req.app.get('io');

    if (io) {
      // 🔹 Récupérer tous les administrateurs
      const [admins] = await db.execute('SELECT public_id FROM users WHERE role = ?', ['admin']);

      // Message pour les admins
      const adminMessage = `Un livreur (${livreur.prenom} ${livreur.nom}) a été assigné à la commande #${publicId} par l'administrateur ${req.user.prenom} ${req.user.nom}`;
      const adminLink = `/admin/livraisons/${publicId}`;

      // 🔔 Notification persistante pour chaque admin
      for (const admin of admins) {
        await Notification.create({
          user_public_id: admin.public_id,
          type: 'livreur_assigne',
          title: '🚚 Livreur assigné',
          message: adminMessage,
          link: adminLink
        });
      }

      // 📨 Notification persistante pour le client
      if (clientPublicId) {
        await Notification.create({
          user_public_id: clientPublicId,
          type: 'livreur_assigne',
          title: '🚚 Livreur en route',
          message: `Un livreur (${livreur.prenom} ${livreur.nom}) a été assigné à votre commande #${publicId}.`,
          link: `/client/commandes/${publicId}`
        });
      }

      // 📨 Notification persistante pour le livreur
      await Notification.create({
        user_public_id: livreurPublicId,
        type: 'livreur_assigne',
        title: '📦 Nouvelle mission',
        message: `Vous avez été assigné à la commande #${publicId}.`,
        link: `/livreur/commandes/${publicId}`
      });

      // ⚡ Émettre en temps réel
      const payload = {
        type: 'livreur_assigne',
        commandeId: publicId,
        livreurId: livreur.public_id,
        updatedAt: new Date()
      };

      if (clientPublicId) {
        io.to(`user_${clientPublicId}`).emit('commande_updated', payload);
      }

      io.to(`user_${livreurPublicId}`).emit('commande_updated', payload);

      // Émettre aux admins (pour mise à jour de l'interface)
      io.to('admins').emit('commande_updated', {
        ...payload,
        adminMessage: `Livreur assigné par ${req.user.prenom} ${req.user.nom}`
      });

      console.log(`📤 Notifications envoyées pour l'assignation du livreur à la commande ${publicId}`);
    }

    res.json(updated);
  } catch (error) {
    console.error('❌ Erreur assignerLivreur:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function annulerAssignation(req, res) {
  try {
    const { publicId } = req.params;

    const commande = await Commande.findByPublicId(publicId);
    if (!commande) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    if (!commande.livreur_id) {
      return res.status(400).json({ error: 'Cette commande n\'est pas assignée à un livreur' });
    }

    const livreurActuel = await User.findById(commande.livreur_id);
    const livreurPublicId = livreurActuel?.public_id || null;

    await commande.desassigner();

    if (livreurActuel) {
      const activeCount = await Commande.countActiveForLivreur(livreurActuel.public_id, true);
      if (activeCount === 0) {
        await User.updateDisponibilite(livreurActuel.public_id, 'Disponible');
      } else if (activeCount < 5) {
        await User.updateDisponibilite(livreurActuel.public_id, 'En livraison');
      } else {
        await User.updateDisponibilite(livreurActuel.public_id, 'Indisponible');
      }
    }

    const updated = await Commande.findByIdWithLivraison(publicId);

    // 1️⃣ Récupérer les parties prenantes
    const client = await User.findById(commande.user_id);
    const clientPublicId = client?.public_id || null;

    // 2️⃣ Récupérer l'instance Socket.IO
    const io = req.app.get('io');

    if (io) {
      // 🔹 Récupérer tous les administrateurs
      const [admins] = await db.execute('SELECT public_id FROM users WHERE role = ?', ['admin']);

      // Message pour les admins
      const adminMessage = `L'assignation du livreur (${livreurActuel?.prenom} ${livreurActuel?.nom}) a été annulée pour la commande #${publicId} par l'administrateur ${req.user.prenom} ${req.user.nom}`;
      const adminLink = `/admin/livraisons/${publicId}`;

      // 🔔 Notification persistante pour chaque admin
      for (const admin of admins) {
        await Notification.create({
          user_public_id: admin.public_id,
          type: 'assignation_annulee',
          title: '❌ Assignation annulée',
          message: adminMessage,
          link: adminLink
        });
      }

      // 📨 Notification persistante pour le client
      if (clientPublicId) {
        await Notification.create({
          user_public_id: clientPublicId,
          type: 'assignation_annulee',
          title: '❌ Livreur annulé',
          message: `L'assignation du livreur pour votre commande #${publicId} a été annulée.`,
          link: `/client/commandes/${publicId}`
        });
      }

      // 📨 Notification persistante pour le livreur
      if (livreurPublicId) {
        await Notification.create({
          user_public_id: livreurPublicId,
          type: 'assignation_annulee',
          title: '❌ Mission annulée',
          message: `Votre assignation à la commande #${publicId} a été annulée.`,
          link: `/livreur/commandes/${publicId}`
        });
      }

      // ⚡ Émettre en temps réel
      const payload = {
        type: 'assignation_annulee',
        commandeId: publicId,
        updatedAt: new Date()
      };

      if (clientPublicId) {
        io.to(`user_${clientPublicId}`).emit('commande_updated', payload);
      }

      if (livreurPublicId) {
        io.to(`user_${livreurPublicId}`).emit('commande_updated', payload);
      }

      // Émettre aux admins (pour mise à jour de l'interface)
      io.to('admins').emit('commande_updated', {
        ...payload,
        adminMessage: `Assignation annulée par ${req.user.prenom} ${req.user.nom}`
      });

      console.log(`📤 Notifications envoyées pour l'annulation d'assignation de la commande ${publicId}`);
    }

    res.json(updated);
  } catch (error) {
    console.error('❌ Erreur annulerAssignation:', error);
    res.status(500).json({ error: error.message });
  }
}export async function updateStatutLivraison(req, res) {
  try {
    const { publicId } = req.params;
    const { statut_livraison } = req.body;

    if (!statut_livraison) {
      return res.status(400).json({ error: 'statut_livraison requis' });
    }

    const commande = await Commande.findByPublicId(publicId);
    if (!commande) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    await commande.updateStatutLivraison(statut_livraison);

    // Si la commande est livrée ou annulée, ajuster la disponibilité du livreur
    if (statut_livraison === 'Livrée' || statut_livraison === 'Annulée') {
      if (commande.livreur_id) {
        const livreur = await User.findById(commande.livreur_id);
        if (livreur) {
          const activeCount = await Commande.countActiveForLivreur(livreur.public_id, true);
          if (activeCount === 0) {
            await User.updateDisponibilite(livreur.public_id, 'Disponible');
          } else if (activeCount < 5) {
            const current = await User.findByPublicId(livreur.public_id);
            if (current && current.disponibilite === 'Indisponible') {
              await User.updateDisponibilite(livreur.public_id, 'En livraison');
            }
          }
        }
      }
    }

    const updated = await Commande.findByIdWithLivraison(publicId);

    // 1️⃣ Récupérer les parties prenantes
    const client = await User.findById(commande.user_id);
    const clientPublicId = client?.public_id || null;

    let livreurPublicId = null;
    if (commande.livreur_id) {
      const livreur = await User.findById(commande.livreur_id);
      livreurPublicId = livreur?.public_id || null;
    }

    // 2️⃣ Récupérer l'instance Socket.IO
    const io = req.app.get('io');

    if (io) {
      // 🔹 Récupérer tous les administrateurs
      const [admins] = await db.execute('SELECT public_id FROM users WHERE role = ?', ['admin']);

      const adminMessage = `Le statut de livraison de la commande #${publicId} est passé à "${statut_livraison}" par l'administrateur ${req.user.prenom} ${req.user.nom}.`;
      const adminLink = `/admin/livraisons/${publicId}`;

      // 🔔 Notification persistante pour chaque admin
      for (const admin of admins) {
        await Notification.create({
          user_public_id: admin.public_id,
          type: 'statut_livraison_change',
          title: '📦 Avancement livraison',
          message: adminMessage,
          link: adminLink
        });
      }

      // 📨 Notification persistante pour le client
      if (clientPublicId) {
        await Notification.create({
          user_public_id: clientPublicId,
          type: 'statut_livraison_change',
          title: '📦 Statut de votre livraison',
          message: `Le statut de livraison de votre commande #${publicId} est passé à "${statut_livraison}".`,
          link: `/client/commandes/${publicId}`
        });
      }

      // 📨 Notification persistante pour le livreur
      if (livreurPublicId) {
        await Notification.create({
          user_public_id: livreurPublicId,
          type: 'statut_livraison_change',
          title: '📦 Statut de livraison',
          message: `Le statut de livraison de la commande #${publicId} que vous gérez est passé à "${statut_livraison}".`,
          link: `/livreur/commandes/${publicId}`
        });
      }

      // ⚡ Émettre en temps réel
      const payload = {
        type: 'statut_livraison_change',
        commandeId: publicId,
        newStatutLivraison: statut_livraison,
        updatedAt: new Date()
      };

      if (livreurPublicId) {
        io.to(`user_${livreurPublicId}`).emit('commande_updated', payload);
      }
      if (clientPublicId) {
        io.to(`user_${clientPublicId}`).emit('commande_updated', payload);
      }

      // Émettre aux admins
      io.to('admins').emit('commande_updated', {
        ...payload,
        adminMessage: `Statut de livraison mis à jour par ${req.user.prenom} ${req.user.nom}`
      });

      console.log(`📤 Notifications envoyées pour le changement de statut de livraison de la commande ${publicId}`);
    }

    res.json(updated);
  } catch (error) {
    console.error('❌ Erreur updateStatutLivraison:', error);
    res.status(500).json({ error: error.message });
  }
}