import Commande from '../../models/Commande.js';
import DetailsCommande from '../../models/DetailsCommande.js';
import Service from '../../models/Service.js';
import User from '../../models/User.js';        // ← ajout
import db from '../../config/db.js';            // ← ajout

// Créer une nouvelle commande
export async function creerCommande(req, res) {
    try {
        const {
            adresse_collecte,
            adresse_livraison,
            note_client,
            date_collecte,
            date_livraison,
            services
        } = req.body;

        if (!services || services.length === 0) {
            return res.status(400).json({ error: 'Au moins un service est requis' });
        }

        const commande = new Commande({
            user_public_id: req.user.public_id,
            adresse_collecte,
            adresse_livraison,
            note_client,
            date_collecte,
            date_livraison
        });

        await commande.Commander();

        let montantTotal = 0;
        for (const item of services) {
            const service = await Service.findByPublicId(item.service_public_id);
            if (!service) {
                throw new Error(`Service ${item.service_public_id} introuvable`);
            }

            const detail = new DetailsCommande({
                commande_id: commande.id,
                service_id: service.id,
                quantite: item.quantite,
                prix_unitaire_scelle: service.prix_unitaire,
                details: item.details || null
            });
            await detail.ajouter();
            montantTotal += detail.getPrixTotal();
        }

        commande.montant_total = montantTotal;
        await commande.recalculerTotal();

        res.status(201).json({
            message: 'Commande créée avec succès',
            commande: commande.toJSON()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

// Récupérer toutes les commandes de l'utilisateur connecté
export async function getMesCommandes(req, res) {
    try {
        const commandes = await Commande.findByUserPublicId(req.user.public_id);
        res.json(commandes.map(c => c.toJSON()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Récupérer une commande spécifique avec ses détails (version complète)
export async function getCommandeDetails(req, res) {
    try {
        const { publicId } = req.params;
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) {
            return res.status(404).json({ error: 'Commande introuvable' });
        }

        // Vérifier autorisation (propriétaire ou admin)
        if (commande.user_public_id !== req.user.public_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        const details = await commande.getDetails();
        const client = await User.findByPublicId(commande.user_public_id);
        const commandeData = commande.toJSON();
        commandeData.client = client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
        commandeData.phone = client ? client.telephone : null;
        commandeData.depositDate = commande.created_at;
        commandeData.expectedDate = commande.date_livraison;
        commandeData.amount = commande.montant_total;
        commandeData.status = commande.statut;
        commandeData.services = details.map(d => d.toJSON());

        res.json(commandeData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Annuler une commande (par le client)
export async function annulerCommande(req, res) {
    try {
        const { publicId } = req.params;
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) return res.status(404).json({ error: 'Commande introuvable' });
        if (commande.user_public_id !== req.user.public_id) {
            return res.status(403).json({ error: 'Action non autorisée' });
        }
        if (commande.statut !== 'En attente') {
            return res.status(400).json({ error: 'Cette commande ne peut plus être annulée' });
        }
        await commande.annuler();
        res.json({ message: 'Commande annulée avec succès', commande: commande.toJSON() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Mettre à jour le statut (admin)
export async function updateCommandeStatus(req, res) {
    try {
        const { publicId } = req.params;
        const { status } = req.body;
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) return res.status(404).json({ error: 'Commande introuvable' });

        const statutMap = {
            'En cours': 'En cours',
            'Prête à retirer': 'Payée',
            'Livrée': 'Livrée'
        };
        const nouveauStatut = statutMap[status];
        if (!nouveauStatut) {
            return res.status(400).json({ error: 'Statut invalide' });
        }
        await commande.updateStatut(nouveauStatut);
        res.json({ message: 'Statut mis à jour', commande: commande.toJSON() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Liste toutes les commandes avec infos client (admin)
export async function getAllCommandes(req, res) {
    try {
        const commandes = await Commande.findAllWithClientInfo();
        res.json(commandes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Modifier l'adresse de livraison (client, commande en attente)
export async function modifierAdresseLivraison(req, res) {
    try {
        const { publicId } = req.params;
        const { adresse_livraison } = req.body;
        const commande = await Commande.findByPublicId(publicId);
        if (!commande) return res.status(404).json({ error: 'Commande introuvable' });
        if (commande.user_public_id !== req.user.public_id) {
            return res.status(403).json({ error: 'Action non autorisée' });
        }
        if (commande.statut !== 'En attente') {
            return res.status(400).json({ error: 'La commande ne peut plus être modifiée' });
        }

        await db.execute(
            `UPDATE commandes SET adresse_livraison = ?, row_stamp = row_stamp + 1, updated_at = NOW()
             WHERE public_id = ?`,
            [adresse_livraison, publicId]
        );

        commande.adresse_livraison = adresse_livraison;
        res.json({ message: 'Adresse modifiée', commande: commande.toJSON() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}