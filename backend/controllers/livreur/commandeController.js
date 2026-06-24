import Commande from '../../models/commandes.js';
import User from '../../models/users.js';

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

    if (!statut_livraison) {
      return res.status(400).json({ error: 'statut_livraison requis' });
    }
    if (!publicId) {
      return res.status(400).json({ error: 'Identifiant de commande manquant' });
    }

    const commande = await Commande.findByPublicId(publicId);
    if (!commande) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    await commande.updateStatutLivraison(statut_livraison);

    // Libération du livreur si la livraison est terminée
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

    // ✅ Émission WebSocket
    const io = req.app.get('io');
    if (io) {
      let livreurPublicId = null;
      if (commande.livreur_id) {
        const livreur = await User.findById(commande.livreur_id);
        livreurPublicId = livreur?.public_id || null;
      }

      const client = await User.findById(commande.user_id);
      const clientPublicId = client?.public_id || null;

      const payload = {
        type: 'statut_livraison_change',
        commandeId: publicId,
        newStatutLivraison: statut_livraison,
        updatedAt: new Date()
      };

      // Notifier le livreur
      if (livreurPublicId) {
        io.to(`user_${livreurPublicId}`).emit('commande_updated', payload);
      }
      // Notifier le client
      if (clientPublicId) {
        io.to(`user_${clientPublicId}`).emit('commande_updated', payload);
      }
      // ✅ Notifier l'administrateur
      io.to('admins').emit('commande_updated', payload);
      console.log(`📤 Notification envoyée à l'admin pour la commande ${publicId}`);
    }

    res.json(updated);
  } catch (error) {
    console.error('❌ Erreur updateStatutLivraison:', error);
    res.status(500).json({ error: error.message });
  }
}// ✅ accolade fermante ajoutée ici

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

// ========================================
// 7. Marquer une commande comme payée
// ========================================
export const marquerCommandePayee = async (req, res) => {
  try {
    const { id } = req.params;
    const livreurId = req.user.public_id;

    const commande = await Commande.findByPublicId(id);
    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }
    const livreurNum = await User.findByPublicId(livreurId);
    if (!livreurNum || commande.livreur_id !== livreurNum.id) {
      return res.status(403).json({ success: false, message: 'Vous n\'êtes pas assigné à cette commande' });
    }
    if (commande.statut !== 'En attente') {
      return res.status(400).json({ success: false, message: 'Cette commande ne peut pas être payée (statut actuel : ' + commande.statut + ')' });
    }

    await commande.marquerPayee();
    res.json({
      success: true,
      message: 'Commande marquée comme payée',
      data: commande.toJSON()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};