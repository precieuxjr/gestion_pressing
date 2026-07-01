import db from '../../config/db.js';
import Paiement from '../../models/paiements.js';
import Commande from '../../models/commandes.js';
import Notification from '../../models/Notification.js';
import User from '../../models/users.js';

// ==========================================
// CLIENT – Récupérer ses paiements
// ==========================================
export const getMesPaiements = async (req, res) => {
  try {
    const clientId = req.user.id;
    const paiements = await Paiement.findByClientId(clientId);
    res.json({ success: true, data: paiements });
  } catch (error) {
    console.error('❌ Erreur getMesPaiements:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// CLIENT – Récupérer un paiement spécifique
// ==========================================
export const getMonPaiement = async (req, res) => {
  try {
    const { publicId } = req.params;
    const clientId = req.user.id;

    const belongs = await Paiement.belongsToClient(publicId, clientId);
    if (!belongs) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }

    const paiement = await Paiement.findByPublicId(publicId);
    if (!paiement) {
      return res.status(404).json({ success: false, message: 'Paiement introuvable' });
    }

    res.json({ success: true, data: paiement });
  } catch (error) {
    console.error('❌ Erreur getMonPaiement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// CLIENT – Créer un paiement (avec notifications)
// ==========================================
export const createPaiementClient = async (req, res) => {
  try {
    const clientPublicId = req.user.public_id;
    const { commande_public_id, montant, mode_paiement, transaction_id } = req.body;

    // 1️⃣ Validation
    if (!commande_public_id || !montant || montant <= 0 || !mode_paiement) {
      return res.status(400).json({ error: 'commande_public_id, montant et mode_paiement sont requis' });
    }

    // 2️⃣ Créer le paiement via le modèle
    const paiement = await Paiement.createForClient(
      commande_public_id,
      clientPublicId,
      montant,
      mode_paiement,
      transaction_id
    );

    // 3️⃣ Récupérer l'instance Socket.IO
    const io = req.app.get('io');

    if (io) {
      // 🔹 Récupérer tous les administrateurs
      const [admins] = await db.execute('SELECT public_id FROM users WHERE role = ?', ['admin']);

      // Message pour les admins
      const adminMessage = `Un paiement de ${montant.toLocaleString()} FC a été initié pour la commande #${commande_public_id} par le client ${req.user.prenom} ${req.user.nom}`;
      const adminLink = `/admin/paiements/${paiement.public_id}`;

      // 🔔 Notification persistante pour chaque admin
      for (const admin of admins) {
        await Notification.create({
          user_public_id: admin.public_id,
          type: 'paiement_initie',
          title: '💳 Paiement initié',
          message: adminMessage,
          link: adminLink
        });
      }

      // 📨 Notification persistante pour le client
      await Notification.create({
        user_public_id: clientPublicId,
        type: 'paiement_cree',
        title: '✅ Paiement enregistré',
        message: `Votre paiement de ${montant.toLocaleString()} FC pour la commande #${commande_public_id} a été enregistré. En attente de confirmation.`,
        link: `/client/paiements/${paiement.public_id}`
      });

      // ⚡ Émettre en temps réel
      io.to('admins').emit('commande_updated', {
        type: 'paiement_initie',
        commandeId: commande_public_id,
        montant: montant,
        mode_paiement: mode_paiement,
        clientId: clientPublicId,
        paiementId: paiement.public_id,
        updatedAt: new Date()
      });

      io.to(`user_${clientPublicId}`).emit('commande_updated', {
        type: 'paiement_cree',
        commandeId: commande_public_id,
        montant: montant,
        mode_paiement: mode_paiement,
        paiementId: paiement.public_id,
        message: 'Votre paiement a été enregistré avec succès.',
        updatedAt: new Date()
      });

      console.log(`📤 Notifications envoyées pour le paiement ${paiement.public_id}`);
    }

    // 4️⃣ Réponse HTTP
    res.status(201).json({
      success: true,
      message: 'Paiement créé avec succès. En attente de confirmation.',
      data: paiement.toJSON(),
    });

  } catch (error) {
    console.error('❌ Erreur createPaiementClient:', error);
    // Gestion des erreurs personnalisées
    if (error.message.includes('Commande introuvable')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('ne vous appartient pas') || error.message.includes('Client introuvable')) {
      return res.status(403).json({ error: error.message });
    }
    if (error.message.includes('Impossible de payer')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};