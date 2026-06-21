import Commande from '../../models/commandes.js';
import DetailsCommande from '../../models/details_commande.js';
import User from '../../models/users.js';

export async function getAllCommandes(req, res) {
    try {
        const commandes = await Commande.findAllWithClientInfo();
        res.json(commandes);
    } catch (error) {
        console.error("Erreur SQL :", error);
        res.status(500).json({ error: error.message })
    }
}

export async function getCommandeDetails(req, res) {
    try {
        const { publicId } = req.params;
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) return res.status(404).json({ error: 'Commande introuvable' });

        const details = await commande.getDetails();
        const client = await User.findById(commande.user_id);

        // ---------------------- INSERTION ICI --------------------------
        // Transforme les détails en objets simples pour le frontend
        const servicesList = details.map(d => ({
            id: d.id,
            public_id: d.public_id,
            service_nom: d.service_nom || d.nom,
            quantite: d.quantite,
            prix_unitaire_scelle: d.prix_unitaire_scelle,
            prix_total: d.quantite * d.prix_unitaire_scelle,
            details: d.details || null
        }));
        // --------------------------------------------------------------

        const commandeData = commande.toJSON();
        commandeData.client = client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
        commandeData.phone = client?.telephone || null;
        commandeData.email = client?.email || null;
        commandeData.depositDate = commande.created_at;
        commandeData.expectedDate = commande.date_livraison;
        commandeData.amount = commande.montant_total;
        commandeData.statut = commande.statut;
        commandeData.services = servicesList;   // ← utilise la variable transformée

        res.json(commandeData);
    } catch (error) {
        console.error('❌ Erreur getCommandeDetails:', error);
        res.status(500).json({ error: error.message })
    }
}

export async function updateCommandeStatus(req, res) {
    console.log('📥 Corps reçu :', req.body);
    console.log('📥 Status reçu :', req.body.status);
    try {
        const { publicId } = req.params;
        const { status } = req.body;

        // Vérifier que status est valide
        const statutsValides = ['En attente', 'Payée', 'Annulée', 'Prêt', 'Retirer', 'Livrée'];
        if (!statutsValides.includes(status)) {
            return res.status(400).json({ error: 'Statut invalide' });
        }

        // Récupérer la commande
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) return res.status(404).json({ error: 'Commande introuvable' });

        // Appeler la méthode du modèle
        await commande.updateStatut(status);

        res.json({ message: 'Statut mis à jour', commande: commande.toJSON() });
    } catch (error) {
        console.error('❌ Erreur updateStatus:', error);
        res.status(500).json({ error: error.message });
    }
}
    
export async function updateCommandeDates(req, res) {
    try {
        const { publicId } = req.params;
        const { date_collecte, date_livraison } = req.body;
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) return res.status(404).json({ error: 'Commande introuvable' });
        if (date_collecte) await commande.updateDateCollecte(date_collecte);
        if (date_livraison) await commande.updateDateLivraison(date_livraison);
        res.json({ message: 'Dates mises à jour', commande: commande.toJSON() });
    } catch (error) {
        console.error('❌ Erreur updateDates:', error);
        res.status(500).json({ error: error.message })
    }
}

export async function supprimerCommande(req, res) {
    try {
        const { publicId } = req.params;
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) return res.status(404).json({ error: 'Commande introuvable' });
        if (!['En attente', 'Annulée'].includes(commande.statut)) {
            return res.status(400).json({ error: 'Cette commande ne peut pas être supprimée' });
        }
        const deleted = await Commande.deleteByPublicId(publicId);
        if (!deleted) return res.status(404).json({ error: 'Commande introuvable' });
        res.json({ message: 'Commande supprimée avec succès' });
    } catch (error) {
        console.error('❌ Erreur suppression:', error);
        res.status(500).json({ error: error.message })
    }
}

export async function getCommandesStats(req, res) {
    try {
        const stats = await Commande.getStats();
        res.json(stats);
    } catch (error) {
        console.error('❌ Erreur stats:', error);
        res.status(500).json({ error: error.message })
    }
}