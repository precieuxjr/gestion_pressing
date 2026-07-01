// controllers/client/CommandeController.js
import db from '../../config/db.js';
import Commande from '../../models/commandes.js';
import User from '../../models/users.js';
import DetailsCommande from '../../models/details_commande.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Notification from '../../models/Notification.js';
// =========================================
// Contrôleur login (à corriger)
// =========================================


// =========================================
// 1. Récupérer les commandes du client
// =========================================
export const getMesCommandes = async (req, res) => {
  try {
    const clientId = req.user.public_id;
    const rows = await Commande.findByUserPublicId(clientId);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Erreur getMesCommandes:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================
// 2. Détails d'une commande spécifique
// =========================================
export const getCommandeDetails = async (req, res) => {
  try {
    const { publicId } = req.params;
    const clientId = req.user.public_id;

    const belongs = await Commande.belongsToUser(publicId, clientId);
    if (!belongs) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }

    const commande = await Commande.findByIdWithLivraison(publicId);
    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }

    // ✅ Ajouter les infos du client depuis req.user (si l'utilisateur connecté est le propriétaire)
    commande.email = req.user.email;
    commande.telephone = req.user.telephone || '—';

    const details = await commande.getDetails();
    res.json({ success: true, data: { commande: commande.toJSON(), details } });
  } catch (error) {
    console.error('❌ Erreur getCommandeDetails:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// =========================================
// 3. Annuler une commande (si possible)
// =========================================
// =========================================
// 3. Annuler une commande (si possible)
// =========================================
export const annulerCommande = async (req, res) => {
  try {
    const { publicId } = req.params;          // ✅ utilisation de publicId
    const clientId = req.user.public_id;
    
    // Vérifier l'appartenance
    const belongs = await Commande.belongsToUser(publicId, clientId);
    if (!belongs) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }

    const commande = await Commande.findByPublicId(publicId);
    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }
    console.log('🔍 Statut récupéré depuis la base :', JSON.stringify(commande.statut));
    console.log('🔍 Type de la variable :', typeof commande.statut);
    console.log('🔍 Est-ce strictement égal à "En attente" ?', commande.statut === 'En attente');
    // Vérifier si annulable (uniquement si en attente)
    if (!commande.peutEtreAnnulee()) {
      return res.status(400).json({ success: false, message: 'Cette commande ne peut plus être annulée' });
    }

    await commande.annuler();
    res.json({ success: true, message: 'Commande annulée avec succès', data: commande.toJSON() });
  } catch (error) {
    console.error('❌ Erreur annulerCommande:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================
// 4. Récupérer le profil du client
// =========================================
export const getProfil = async (req, res) => {
  try {
    const clientId = req.user.public_id;
    const user = await User.findByPublicId(clientId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    }
    delete user.password;
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('❌ Erreur getProfil:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================
// 5. Mettre à jour le profil
// =========================================
export const updateProfil = async (req, res) => {
  try {
    const clientId = req.user.public_id;
    const { nom, prenom, telephone, adresse } = req.body;

    const updated = await User.updateProfile(clientId, { nom, prenom, telephone, adresse });
    res.json({ success: true, message: 'Profil mis à jour', data: updated });
  } catch (error) {
    console.error('❌ Erreur updateProfil:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================
// 6. Obtenir les statistiques client
// =========================================
export const getStats = async (req, res) => {
  try {
    const clientId = req.user.public_id;
    const stats = await Commande.getStatsForUser(clientId);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('❌ Erreur getStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================
// 7. Modifier l'adresse de livraison
// =========================================
export const modifierAdresseLivraison = async (req, res) => {
  const clientPublicId = req.user.public_id;
  const { publicId } = req.params;
  const { adresse_livraison } = req.body;

  if (!adresse_livraison || adresse_livraison.trim().length < 3) {
    return res.status(400).json({ error: 'Adresse de livraison valide requise (au moins 3 caractères).' });
  }

  try {
    const commande = await Commande.findByPublicId(publicId);
    if (!commande) {
      return res.status(404).json({ error: 'Commande introuvable.' });
    }

    await commande.updateAdresseLivraison(adresse_livraison, clientPublicId);

    res.json({
      message: 'Adresse de livraison mise à jour avec succès.',
      data: commande.toJSON ? commande.toJSON() : commande,
    });
  } catch (error) {
    console.error('❌ Erreur modifierAdresseLivraison:', error);
    if (error.message.includes('Client introuvable') || error.message.includes('autorisation')) {
      return res.status(403).json({ error: error.message });
    }
    if (error.message.includes('valide requise')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes('déjà en statut')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// =========================================
// 8. Créer une commande
// =========================================
// =========================================
// 8. Créer une commande
// =========================================// =========================================
// 8. Créer une commande (version complète)
// =========================================

export const creerCommande = async (req, res) => {
  const clientPublicId = req.user.public_id;

  const {
    services,
    adresse_collecte,
    adresse_livraison,
    mode_paiement = 'Espèces',
    date_livraison_souhaitee,
    notes = ''
  } = req.body;

  // 1️⃣ Validation
  if (!services || !Array.isArray(services) || services.length === 0) {
    return res.status(400).json({ error: 'Au moins un service est requis.' });
  }
  if (!adresse_collecte || !adresse_livraison) {
    return res.status(400).json({ error: 'Les adresses de collecte et de livraison sont obligatoires.' });
  }

  try {
    // 2️⃣ Récupérer l'ID numérique du client
    const [userRow] = await db.execute('SELECT id FROM users WHERE public_id = ?', [clientPublicId]);
    if (!userRow || userRow.length === 0) {
      return res.status(404).json({ error: 'Client introuvable.' });
    }
    const userId = userRow[0].id;

    // 3️⃣ Calcul du montant total et détails
    let montantTotal = 0;
    const detailsData = [];

    for (const item of services) {
      const { service_id, quantite, prix_unitaire } = item;
      if (!service_id || !quantite || quantite <= 0 || !prix_unitaire || prix_unitaire <= 0) {
        return res.status(400).json({ error: 'Données de service invalides.' });
      }

      const [serviceRow] = await db.execute('SELECT id FROM services WHERE id = ?', [service_id]);
      if (!serviceRow || serviceRow.length === 0) {
        return res.status(400).json({ error: `Service ID ${service_id} inexistant.` });
      }

      const lineTotal = quantite * prix_unitaire;
      montantTotal += lineTotal;
      detailsData.push({ service_id, quantite, prix_unitaire, total_ligne: lineTotal });
    }

    // 4️⃣ Créer la commande
    const commande = new Commande({
      user_id: userId,
      adresse_collecte,
      adresse_livraison,
      mode_paiement,
      note_client: notes,
      date_livraison: date_livraison_souhaitee || null,
      montant_total: montantTotal,
      statut: 'En attente'
    });
    await commande.Commander();

    // 5️⃣ Insérer les détails
    const commandeId = commande.id;
    for (const detail of detailsData) {
      const detailObj = new DetailsCommande({
        commande_id: commandeId,
        service_id: detail.service_id,
        quantite: detail.quantite,
        prix_unitaire_scelle: detail.prix_unitaire,
        total_ligne: detail.total_ligne
      });
      await detailObj.save();
    }
    console.log(`✅ ${detailsData.length} services insérés pour la commande ${commande.public_id}`);

    // 6️⃣ Récupérer la commande complète
    const commandeComplete = await Commande.findByIdWithLivraison(commande.public_id);
    const details = await commandeComplete.getDetails();

    // 7️⃣ Récupérer l'instance de Socket.IO
    const io = req.app.get('io');

    if (io) {
      // 📌 Récupérer tous les administrateurs (pour les notifications persistantes)
      const [admins] = await db.execute('SELECT public_id FROM users WHERE role = ?', ['admin']);

      // Message commun pour les admins
      const adminMessage = `Nouvelle commande #${commande.public_id} créée par ${req.user.prenom} ${req.user.nom}`;
      const adminLink = `/admin/commandes/${commande.public_id}`;

      // 🔔 Créer une notification en base pour chaque admin
      for (const admin of admins) {
        await Notification.create({
          user_public_id: admin.public_id,
          type: 'nouvelle_commande',
          title: '📦 Nouvelle commande',
          message: adminMessage,
          link: adminLink
        });
      }

      // 📨 Notification pour le client
      await Notification.create({
        user_public_id: clientPublicId,
        type: 'commande_creee',
        title: '✅ Commande créée',
        message: 'Votre commande a été créée avec succès. En attente de validation par l\'administrateur.',
        link: `/client/commandes/${commande.public_id}`
      });

      // ⚡ Émettre en temps réel
      io.to('admins').emit('commande_updated', {
        type: 'nouvelle_commande',
        commandeId: commande.public_id,
        userId: userId,
        updatedAt: new Date()
      });

      io.to(`user_${clientPublicId}`).emit('commande_updated', {
        type: 'commande_creee',
        commandeId: commande.public_id,
        statut: 'En attente',
        message: 'Votre commande a été créée avec succès. En attente de validation par l\'administrateur.',
        updatedAt: new Date()
      });

      console.log(`📤 Notifications envoyées pour la commande ${commande.public_id}`);
    }

    // 8️⃣ Réponse HTTP
    res.status(201).json({
      message: 'Commande créée avec succès.',
      data: {
        commande: commandeComplete.toJSON ? commandeComplete.toJSON() : commandeComplete,
        details
      }
    });

  } catch (error) {
    console.error('❌ Erreur creerCommande:', error);
    res.status(500).json({ error: error.message });
  }
};