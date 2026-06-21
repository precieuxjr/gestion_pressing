import Commande from '../models/commandes.js';
import User from '../../models/users.js';


// Contrôleur login (unique)
export default async function login(req, res) {
  const user = await User.findByEmail(email);
  // Vérification du mot de passe, génération du token...
  const token = jwt.sign({ public_id, email, role }, JWT_SECRET);
  res.json({ token, user: { public_id, email, role,} });
}








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
    const { id } = req.params;
    const clientId = req.user.public_id;

    // Vérifier que la commande existe et appartient au client
    const belongs = await Commande.belongsToUser(id, clientId);
    if (!belongs) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }

    const commande = await Commande.findByIdWithLivraison(id);
    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }

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
export const annulerCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user.public_id;

    // Vérifier l'appartenance
    const belongs = await Commande.belongsToUser(id, clientId);
    if (!belongs) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }

    const commande = await Commande.findByPublicId(id);
    if (!commande) {
      return res.status(404).json({ success: false, message: 'Commande introuvable' });
    }

    // Vérifier si annulable (délégation au modèle via une méthode)
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