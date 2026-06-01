import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

export default class DetailsCommande {
    constructor(data = {}) {
        this.public_id = data.public_id;
        this.commande_id = data.commande_id;           // clé étrangère vers commandes.id (INT)
        this.service_id = data.service_id;             // clé étrangère vers services.id (INT)
        this.quantite = data.quantite || 1;
        this.prix_unitaire_scelle = data.prix_unitaire_scelle || 0;
        this.row_stamp = data.row_stamp || 1;
        this.details = data.details || null;           // instructions ou remarques
        this.motif_refus = data.motif_refus || null;   // si le service est refusé
        
    }

    // Calculer le prix total (quantité × prix unitaire)
    getPrixTotal() {
        return this.quantite * this.prix_unitaire_scelle;
    }

    // Ajouter un détail à une commande
    async ajouter() {
        // Validations
        if (!this.commande_id) {
            throw new Error('L\'identifiant de la commande est requis');
        }
        if (!this.service_id) {
            throw new Error('L\'identifiant du service est requis');
        }
        if (this.quantite <= 0) {
            throw new Error('La quantité doit être supérieure à 0');
        }
        if (this.prix_unitaire_scelle <= 0) {
            throw new Error('Le prix unitaire doit être supérieur à 0');
        }

        // Générer un public_id
        this.public_id = uuidv4();

        const [result] = await db.execute(
            `INSERT INTO details_commands 
            (public_id, commande_id, service_id, quantite, prix_unitaire_scelle, row_stamp, details, motif_refus)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                this.public_id,
                this.commande_id,
                this.service_id,
                this.quantite,
                this.prix_unitaire_scelle,
                this.row_stamp,
                this.details,
                this.motif_refus
            ]
        );

        this.id = result.insertId;
        
        // Mettre à jour le montant total de la commande parente
        await this.mettreAJourTotalCommande();
        
        return this;
    }

    // Récupérer tous les détails d'une commande (par commande_id)
    static async findByCommandeId(commandeId) {
        const [rows] = await db.execute(
            `SELECT d.*, s.nom as service_nom, s.description as service_description
             FROM details_commands d
             JOIN services s ON d.service_id = s.id
             WHERE d.commande_id = ?
             ORDER BY d.created_at ASC`,
            [commandeId]
        );
        return rows.map(row => new DetailsCommande(row));
    }

    // Récupérer un détail par son public_id
    static async findByPublicId(publicId) {
        const [rows] = await db.execute(
            `SELECT d.*, s.nom as service_nom, s.description as service_description
             FROM details_commands d
             JOIN services s ON d.service_id = s.id
             WHERE d.public_id = ?`,
            [publicId]
        );
        return rows.length ? new DetailsCommande(rows[0]) : null;
    }

    // Mettre à jour la quantité
    async updateQuantite(nouvelleQuantite) {
        if (nouvelleQuantite <= 0) {
            throw new Error('La quantité doit être supérieure à 0');
        }

        this.quantite = nouvelleQuantite;
        this.row_stamp += 1;

        const [result] = await db.execute(
            `UPDATE details_commands 
             SET quantite = ?, row_stamp = ?
             WHERE public_id = ?`,
            [this.quantite, this.row_stamp, this.public_id]
        );

        if (result.affectedRows === 0) {
            throw new Error('Détail de commande introuvable');
        }

        // Mettre à jour le montant total de la commande parente
        await this.mettreAJourTotalCommande();

        return this;
    }

    // Mettre à jour les détails/instructions
    async updateDetails(nouveauxDetails) {
        this.details = nouveauxDetails;
        this.row_stamp += 1;

        await db.execute(
            `UPDATE details_commands 
             SET details = ?, row_stamp = ?
             WHERE public_id = ?`,
            [this.details, this.row_stamp, this.public_id]
        );

        return this;
    }

    // Refuser un service avec motif
    async refuser(motif) {
        if (!motif || motif.trim() === '') {
            throw new Error('Un motif de refus est requis');
        }

        this.motif_refus = motif;
        this.row_stamp += 1;

        await db.execute(
            `UPDATE details_commands 
             SET motif_refus = ?, row_stamp = ?
             WHERE public_id = ?`,
            [this.motif_refus, this.row_stamp, this.public_id]
        );

        return this;
    }

    // Supprimer un détail
    async supprimer() {
        const [result] = await db.execute(
            `DELETE FROM details_commands WHERE public_id = ?`,
            [this.public_id]
        );

        if (result.affectedRows === 0) {
            throw new Error('Détail de commande introuvable');
        }

        // Mettre à jour le montant total de la commande parente
        await this.mettreAJourTotalCommande();

        return true;
    }

    // Recalculer et mettre à jour le montant total de la commande parente
    async mettreAJourTotalCommande() {
        const [rows] = await db.execute(
            `SELECT SUM(quantite * prix_unitaire_scelle) as total 
             FROM details_commands 
             WHERE commande_id = ?`,
            [this.commande_id]
        );
        
        const nouveauTotal = rows[0].total || 0;
        
        await db.execute(
            `UPDATE commandes 
             SET montant_total = ?, row_stamp = row_stamp + 1, updated_at = NOW()
             WHERE id = ?`,
            [nouveauTotal, this.commande_id]
        );
    }

    // Vérifier si le service a été refusé
    estRefuse() {
        return this.motif_refus !== null && this.motif_refus.trim() !== '';
    }

    toJSON() {
        return {
            public_id: this.public_id,
            commande_id: this.commande_id,
            service_id: this.service_id,
            service_nom: this.service_nom,
            service_description: this.service_description,
            quantite: this.quantite,
            prix_unitaire_scelle: this.prix_unitaire_scelle,
            prix_total: this.getPrixTotal(),
            row_stamp: this.row_stamp,
            details: this.details,
            motif_refus: this.motif_refus,
            est_refuse: this.estRefuse(),
            
        };
    }


    async getDetails() {
        return await DetailsCommande.findByCommandeId(this.id);
    }


}