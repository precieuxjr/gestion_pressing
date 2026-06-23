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
// CLIENT – Créer un paiement
// ==========================================
export const createPaiementClient = async (req, res) => {
  try {
    const clientPublicId = req.user.public_id;
    const { commande_public_id, montant, mode_paiement, transaction_id } = req.body;

    if (!commande_public_id || !montant || montant <= 0 || !mode_paiement) {
      return res.status(400).json({ error: 'commande_public_id, montant et mode_paiement sont requis' });
    }

    // ✅ Créer le paiement
    const paiement = await Paiement.createForClient(
      commande_public_id,
      clientPublicId,
      montant,
      mode_paiement,
      transaction_id
    );

    // ✅ Émettre une notification WebSocket (paiement créé par le client)
    const io = req.app.get('io');
    if (io) {
      io.emit('commande_updated', {
        type: 'paiement_initie',
        commandeId: commande_public_id,
        montant: montant,
        mode_paiement: mode_paiement,
        clientId: clientPublicId,
        updatedAt: new Date()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Paiement créé avec succès. En attente de confirmation.',
      data: paiement.toJSON(),
    });
  } catch (error) {
    console.error('❌ Erreur createPaiementClient:', error);
    // Gestion des erreurs
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
