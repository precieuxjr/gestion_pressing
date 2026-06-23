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
    this.created_at = data.created_at;        // ✅ ajout
    this.updated_at = data.updated_at;        // ✅ ajout
    this.client_nom = data.client_nom;        // ✅ ajout
    this.commande_reference = data.commande_reference; // ✅ ajout
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
    // ✅ On ne force plus 'Validé', on garde la valeur par défaut ou celle passée
    if (!this.statut_paiement) this.statut_paiement = 'En attente'; 

    const [result] = await db.execute(
      `INSERT INTO paiements (public_id, commande_id, montant, mode_paiement, statut_paiement, transaction_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [this.public_id, this.commande_id, this.montant, this.mode_paiement, this.statut_paiement, this.transaction_id]
    );
    this.id = result.insertId;
    this.created_at = new Date();
    return this;
  }
// models/paiements.js
async confirmerParAdmin(adminId) {
    if (this.statut_paiement !== 'En attente') {
      throw new Error('Seul un paiement en attente peut être confirmé');
    }
  
    // Récupérer la commande par son public_id (pour mise à jour)
    const [commandeRows] = await db.execute('SELECT public_id FROM commandes WHERE id = ?', [this.commande_id]);
    if (commandeRows.length === 0) {
      throw new Error('Commande associée introuvable');
    }
    const commandePublicId = commandeRows[0].public_id;
    const commande = await Commande.findByPublicId(commandePublicId);
    if (!commande) {
      throw new Error('Commande associée introuvable');
    }
  
    // Mettre à jour le paiement
    await db.execute(
      `UPDATE paiements SET statut_paiement = 'Payé', updated_at = NOW() WHERE public_id = ?`,
      [this.public_id]
    );
    this.statut_paiement = 'Payé';
  
    // Mettre à jour la commande
    await commande.updateStatut('Payée');
  
    return {
      paiement: this,
      commande: commande,
    };
  }

    async updateStatut(nouveauStatut) {
  
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
                SUM(CASE WHEN statut_paiement = 'Payé' THEN montant ELSE 0 END) as montant_valide,
                SUM(CASE WHEN statut_paiement = 'Remboursé' THEN montant ELSE 0 END) as montant_rembourse,
                SUM(CASE WHEN statut_paiement = 'En attente' THEN montant ELSE 0 END) as montant_attente,
                COUNT(CASE WHEN mode_paiement = 'Espèces' THEN 1 END) as nb_especes,
                COUNT(CASE WHEN mode_paiement = 'Carte' THEN 1 END) as nb_carte,
                COUNT(CASE WHEN mode_paiement = 'Mobile Money' THEN 1 END) as nb_mobile_money,
                COUNT(CASE WHEN mode_paiement = 'Virement' THEN 1 END) as nb_virement
            FROM paiements
        `);
        return rows[0];
    }

// Récupérer les paiements d'un client (par son ID numérique)
static async findByClientId(clientId) {
    const [rows] = await db.execute(`
      SELECT p.*, c.reference AS commande_reference
      FROM paiements p
      JOIN commandes c ON p.commande_id = c.id
      WHERE c.user_id = ?
      ORDER BY p.created_at DESC
    `, [clientId]);
    return rows.map(row => new Paiement(row));
  }
  
  // Vérifier si un paiement appartient à un client (par public_id du paiement et ID du client)
  static async belongsToClient(publicId, clientId) {
    const [rows] = await db.execute(`
      SELECT 1
      FROM paiements p
      JOIN commandes c ON p.commande_id = c.id
      WHERE p.public_id = ? AND c.user_id = ?
    `, [publicId, clientId]);
    return rows.length > 0;
  }
// models/paiements.js
static async createForClient(commandePublicId, clientPublicId, montant, modePaiement, transactionId = null) {
    // Vérifier la commande
    const commande = await Commande.findByPublicId(commandePublicId);
    if (!commande) {
      throw new Error('Commande introuvable');
    }
  
    // Vérifier le client
    const [userRow] = await db.execute('SELECT id FROM users WHERE public_id = ?', [clientPublicId]);
    if (!userRow || userRow.length === 0) {
      throw new Error('Client introuvable');
    }
    const clientId = userRow[0].id;
    if (commande.user_id !== clientId) {
      throw new Error('Cette commande ne vous appartient pas');
    }
  
    // Vérifier le statut
    const statutsAutorises = ['En attente', 'Payée'];
    if (!statutsAutorises.includes(commande.statut)) {
      throw new Error(`Impossible de payer une commande en statut "${commande.statut}"`);
    }
  
    // Créer le paiement avec l'ID numérique de la commande
    const paiement = new Paiement({
      commande_id: commande.id,
      montant,
      mode_paiement: modePaiement,
      transaction_id: transactionId || null,
    });
  
    await paiement.creer();
    return paiement;
  }




  static async createForAdmin(commandePublicId, montant, modePaiement, transactionId = null, statut = 'En attente') {
    // Convertir le public_id de la commande en ID numérique
    const [commandeRows] = await db.execute('SELECT id FROM commandes WHERE public_id = ?', [commandePublicId]);
    if (commandeRows.length === 0) {
      throw new Error('Commande introuvable');
    }
    const commandeId = commandeRows[0].id;
  
    // Valider le montant
    if (!montant || montant <= 0) {
      throw new Error('Montant invalide');
    }
    if (!modePaiement) {
      throw new Error('Mode de paiement requis');
    }
  
    const paiement = new Paiement({
      commande_id: commandeId,
      montant,
      mode_paiement: modePaiement,
      transaction_id: transactionId || null,
      statut_paiement: statut,
    });
  
    await paiement.creer();
    return paiement;
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