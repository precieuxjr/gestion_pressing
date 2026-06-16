// backend/models/paiements.js
import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

class Paiement {
    constructor(data = {}) {
        this.id = data.id;
        this.public_id = data.public_id;
        this.commande_id = data.commande_id;
        this.montant = parseFloat(data.montant) || 0;
        this.mode_paiement = data.mode_paiement;
        this.statut_paiement = data.statut_paiement || 'En attente';
        this.transaction_id = data.transaction_id || null;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.client_nom = data.client_nom;
        this.commande_reference = data.commande_reference;
    }

    // Récupérer tous les paiements (avec filtres)
static async findAll(filters = {}) {
    let sql = `
        SELECT p.*, 
               CONCAT(u.prenom, ' ', u.nom) AS client_nom,
               c.reference AS commande_reference
        FROM paiements p
        JOIN commandes c ON p.commande_id = c.id
        JOIN users u ON c.user_id = u.id
        WHERE 1=1
    `;
    const params = [];
    if (filters.statut) {
        sql += ' AND p.statut_paiement = ?';
        params.push(filters.statut);
    }
    if (filters.mode_paiement) {
        sql += ' AND p.mode_paiement = ?';
        params.push(filters.mode_paiement);
    }
    if (filters.date_debut) {
        sql += ' AND p.created_at >= ?';
        params.push(filters.date_debut);
    }
    if (filters.date_fin) {
        sql += ' AND p.created_at <= ?';
        params.push(filters.date_fin);
    }
    sql += ' ORDER BY p.created_at DESC';
    const [rows] = await db.execute(sql, params);
    return rows.map(row => new Paiement(row));
}

    static async findByPublicId(publicId) {
        const [rows] = await db.execute('SELECT * FROM paiements WHERE public_id = ?', [publicId]);
        return rows[0] ? new Paiement(rows[0]) : null;
    }

    // Récupérer les paiements d'une commande
static async findByCommandeId(commandeId) {
    const [rows] = await db.execute(`
        SELECT p.*, 
               CONCAT(u.prenom, ' ', u.nom) AS client_nom,
               c.reference AS commande_reference
        FROM paiements p
        JOIN commandes c ON p.commande_id = c.id
        JOIN users u ON c.user_id = u.id
        WHERE p.commande_id = ?
        ORDER BY p.created_at DESC
    `, [commandeId]);
    return rows.map(row => new Paiement(row));
}

    async creer() {
        if (!this.commande_id) throw new Error('commande_id requis');
        if (!this.montant || this.montant <= 0) throw new Error('Montant invalide');
        if (!this.mode_paiement) throw new Error('Mode de paiement requis');

        this.public_id = uuidv4();
        this.statut_paiement = 'Validé'; // Par défaut
        const now = new Date();

        const [result] = await db.execute(
            `INSERT INTO paiements (public_id, commande_id, montant, mode_paiement, statut_paiement, transaction_id, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [this.public_id, this.commande_id, this.montant, this.mode_paiement, this.statut_paiement, this.transaction_id, now]
        );
        this.id = result.insertId;
        this.created_at = now;
        return this;
    }

    async updateStatut(nouveauStatut) {
        console.log('🔍 updateStatut - this:', this); // Affiche tout l'objet
        console.log('🔍 public_id:', this.public_id); // Affiche la valeur
        if (!this.public_id) {
            throw new Error('public_id manquant dans l\'objet paiement');
        }
        const [result] = await db.execute(
            `UPDATE paiements SET statut_paiement = ? WHERE public_id = ?`,
            [nouveauStatut, this.public_id]
        );
        if (result.affectedRows === 0) throw new Error('Paiement introuvable');
        this.statut_paiement = nouveauStatut;
        return this;
    }

    static async delete(publicId) {
        const [result] = await db.execute('DELETE FROM paiements WHERE public_id = ?', [publicId]);
        if (result.affectedRows === 0) throw new Error('Paiement introuvable');
        return true;
    }

    static async getStats() {
        const [rows] = await db.execute(`
            SELECT 
                COUNT(*) as total_paiements,
                SUM(montant) as montant_total,
                SUM(CASE WHEN statut_paiement = 'Validé' THEN montant ELSE 0 END) as montant_valide,
                SUM(CASE WHEN statut_paiement = 'Remboursé' THEN montant ELSE 0 END) as montant_rembourse,
                COUNT(CASE WHEN mode_paiement = 'Espèces' THEN 1 END) as nb_especes,
                COUNT(CASE WHEN mode_paiement = 'Carte' THEN 1 END) as nb_carte,
                COUNT(CASE WHEN mode_paiement = 'Mobile Money' THEN 1 END) as nb_mobile_money,
                COUNT(CASE WHEN mode_paiement = 'Virement' THEN 1 END) as nb_virement
            FROM paiements
        `);
        return rows[0];
    }

    toJSON() {
        return {
            public_id: this.public_id,
            commande_id: this.commande_id,
            commande_reference: this.commande_reference,
            client_nom: this.client_nom,
            montant: this.montant,
            mode_paiement: this.mode_paiement,
            statut: this.statut_paiement,
            date_paiement: this.created_at,
            reference: this.public_id.substring(0, 8),
            transaction_id: this.transaction_id
        };
    
    }
}

export default Paiement;