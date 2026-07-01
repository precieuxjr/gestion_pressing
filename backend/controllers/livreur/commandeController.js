import Commande from '../../models/commandes.js';
import User from '../../models/users.js';
import DetailsCommande from '../../models/details_commande.js';
import Notification from '../../models/Notification.js';
import db from '../../config/db.js';

// ========================================
// 1. Récupérer les commandes du livreur connecté
// ========================================
export const getMesCommandes = async (req, res) => {
  try {
    const livreurId = req.user.public_id;
    if (!livreurId) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }
    const rows = await Commande.findByLivreurId(livreurId);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// 2. Récupérer les commandes disponibles (statut 'En attente')
// ========================================
export const getCommandesDisponibles = async (req, res) => {
  try {
    const livreurId = req.user.public_id;
    const rows = await Commande.findDisponiblesPourLivreur(livreurId);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// 3. Accepter une commande (s'assigner)
// ========================================
export const accepterCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const livreurId = req.user.public_id;

    const commande = await Commande.findByPublicId(id);
    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }
    if (commande.livreur_id) {
      return res.status(400).json({ success: false, message: 'Cette commande est déjà assignée' });
    }

    await commande.assignerLivreur(livreurId);
    res.json({
      success: true,
      message: 'Commande acceptée avec succès',
      data: commande.toJSON()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// 4. Mettre à jour le statut de livraison
// ========================================
export async function updateStatutLivraison(req, res) {
  try {
    const { publicId } = req.params;
    const { statut_livraison } = req.body;
    console.log('📥 updateStatutLivraison appelé avec publicId:', req.params.publicId);

    // 1️⃣ Validation des entrées
    if (!statut_livraison) {
      return res.status(400).json({ error: 'statut_livraison requis' });
    }
    if (!publicId) {
      return res.status(400).json({ error: 'Identifiant de commande manquant' });
    }

    // 2️⃣ Récupérer la commande
    const commande = await Commande.findByPublicId(publicId);
    if (!commande) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    // 3️⃣ Mettre à jour le statut de livraison
    await commande.updateStatutLivraison(statut_livraison);

    // 4️⃣ Si livrée ou annulée, libérer le livreur
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

    // 5️⃣ Récupérer la commande mise à jour
    const updated = await Commande.findByIdWithLivraison(publicId);

    // 6️⃣ Récupérer les parties prenantes
    const client = await User.findById(commande.user_id);
    const clientPublicId = client?.public_id || null;

    let livreurPublicId = null;
    if (commande.livreur_id) {
      const livreur = await User.findById(commande.livreur_id);
      livreurPublicId = livreur?.public_id || null;
    }

    // 7️⃣ Récupérer l'instance Socket.IO
    const io = req.app.get('io');

    if (io) {
      // 🔹 Récupérer tous les administrateurs
      const [admins] = await db.execute('SELECT public_id FROM users WHERE role = ?', ['admin']);

      // Message pour les admins
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
      // ✅ Notifier les administrateurs
      io.to('admins').emit('commande_updated', {
        ...payload,
        adminMessage: `Statut de livraison mis à jour par ${req.user.prenom} ${req.user.nom}`
      });

      console.log(`📤 Notifications envoyées pour le changement de statut de livraison de la commande ${publicId}`);
    }

    // 8️⃣ Réponse HTTP
    res.json(updated);

  } catch (error) {
    console.error('❌ Erreur updateStatutLivraison:', error);
    res.status(500).json({ error: error.message });
  }
}
// ========================================
// 5. Récupérer les statistiques du livreur
// ========================================
export const getMesStatistiques = async (req, res) => {
  try {
    const livreurId = req.user.public_id;
    const stats = await Commande.getStatsForLivreur(livreurId);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================
// 6. Détails d'une commande spécifique (pour le livreur)
// ========================================
export const getCommandeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const livreurId = req.user.public_id;

    const commande = await Commande.findByIdWithLivraison(id);
    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }
    const livreurNum = await User.findByPublicId(livreurId);
    if (!livreurNum || commande.livreur_id !== livreurNum.id) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }

    const details = await commande.getDetails();
    res.json({
      success: true,
      data: {
        commande: commande.toJSON(),
        details
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};






export const getCommandeDetailsForLivreur = async (req, res) => {
  try {
    const { publicId } = req.params;
    const livreurPublicId = req.user.public_id;

    // Récupérer la commande
    const commande = await Commande.findByPublicId(publicId);
    if (!commande) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    // Vérifier que le livreur est bien assigné à cette commande
    if (!commande.livreur_id) {
      return res.status(403).json({ error: 'Aucun livreur assigné à cette commande' });
    }

    // Récupérer le livreur assigné
    const livreur = await User.findById(commande.livreur_id);
    if (!livreur || livreur.public_id !== livreurPublicId) {
      return res.status(403).json({ error: 'Vous n\'êtes pas le livreur assigné à cette commande' });
    }

    // Récupérer les détails complets
    const commandeComplete = await Commande.findByIdWithLivraison(publicId);
    if (!commandeComplete) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    const details = await commandeComplete.getDetails();

    // Ajouter les informations du client (si disponibles)
    const client = await User.findById(commande.user_id);
    const clientData = client ? {
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse
    } : {};

    res.json({
      success: true,
      data: {
        commande: commandeComplete.toJSON ? commandeComplete.toJSON() : commandeComplete,
        details,
        client: clientData
      }
    });
  } catch (error) {
    console.error('❌ Erreur getCommandeDetailsForLivreur:', error);
    res.status(500).json({ error: error.message });
  }
};
// ========================================
// 7. Marquer une commande comme payée
// ========================================
export const marquerCommandePayee = async (req, res) => {
  try {
    const { id } = req.params;
    const livreurId = req.user.public_id;

    // 1️⃣ Vérifier la commande
    const commande = await Commande.findByPublicId(id);
    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }

    // 2️⃣ Vérifier que le livreur est bien assigné
    const livreurNum = await User.findByPublicId(livreurId);
    if (!livreurNum || commande.livreur_id !== livreurNum.id) {
      return res.status(403).json({ success: false, message: 'Vous n\'êtes pas assigné à cette commande' });
    }

    // 3️⃣ Vérifier le statut actuel (seulement 'En attente' peut être payée)
    if (commande.statut !== 'En attente') {
      return res.status(400).json({
        success: false,
        message: 'Cette commande ne peut pas être payée (statut actuel : ' + commande.statut + ')'
      });
    }

    // 4️⃣ Marquer comme payée via le modèle
    await commande.marquerPayee();

    // 5️⃣ Récupérer les parties prenantes
    const client = await User.findById(commande.user_id);
    const clientPublicId = client?.public_id || null;

    // 6️⃣ Récupérer l'instance Socket.IO
    const io = req.app.get('io');

    if (io) {
      // 🔹 Récupérer tous les administrateurs
      const [admins] = await db.execute('SELECT public_id FROM users WHERE role = ?', ['admin']);

      // Message pour les admins
      const adminMessage = `La commande #${id} a été marquée comme payée par le livreur ${req.user.prenom} ${req.user.nom}.`;
      const adminLink = `/admin/commandes/${id}`;

      // 🔔 Notification persistante pour chaque admin
      for (const admin of admins) {
        await Notification.create({
          user_public_id: admin.public_id,
          type: 'commande_payee',
          title: '💰 Commande payée',
          message: adminMessage,
          link: adminLink
        });
      }

      // 📨 Notification persistante pour le client
      if (clientPublicId) {
        await Notification.create({
          user_public_id: clientPublicId,
          type: 'commande_payee',
          title: '💰 Paiement confirmé',
          message: `Votre commande #${id} a été marquée comme payée par le livreur.`,
          link: `/client/commandes/${id}`
        });
      }

      // ⚡ Émettre en temps réel
      const payload = {
        type: 'commande_payee',
        commandeId: id,
        updatedAt: new Date()
      };

      if (clientPublicId) {
        io.to(`user_${clientPublicId}`).emit('commande_updated', payload);
      }

      // Notifier les admins (pour mise à jour de l'interface)
      io.to('admins').emit('commande_updated', {
        ...payload,
        adminMessage: `Commande marquée payée par ${req.user.prenom} ${req.user.nom}`
      });

      console.log(`📤 Notifications envoyées pour le paiement de la commande ${id}`);
    }

    // 7️⃣ Réponse HTTP
    res.json({
      success: true,
      message: 'Commande marquée comme payée',
      data: commande.toJSON()
    });

  } catch (error) {
    console.error('❌ Erreur marquerCommandePayee:', error);
    res.status(500).json({ success: false, message: error.message });
  } }
