import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';
import DetailsCommande from './details_commande.js';

export default class Commande {
  constructor(data = {}) {
    this.id = data.id;
    this.public_id = data.public_id;
    this.user_id = data.user_id;  
    this.reference = data.reference;
    this.montant_total = data.montant_total || 0;
    this.statut = data.statut || 'En attente';
    this.mode_paiement = data.mode_paiement || null;
    this.adresse_collecte = data.adresse_collecte;
    this.adresse_livraison = data.adresse_livraison;
    this.note_client = data.note_client || null;
    this.date_collecte = data.date_collecte || null;
    this.date_livraison = data.date_livraison || null;
    this.row_stamp = data.row_stamp || 1;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Formater une date pour MySQL DATETIME
  static formater_date(date) {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 19).replace('T', ' ');
  }

  static genererReferenceCommande() {
    const date = new Date();
    const annee = date.getFullYear();
    const mois = String(date.getMonth() + 1).padStart(2, '0');
    const jour = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CMD-${annee}${mois}${jour}-${random}`;
  }

  async Commander() {
    if (!this.user_id) throw new Error("l'identifiant utilisateur est requis !");
    if (!this.adresse_collecte) throw new Error("l'adresse de collecte est requis !");
    if (!this.adresse_livraison) throw new Error("l'adresse de livraison est requis !");

    const statutsValides = ['En attente', 'Payée', 'En cours', 'Livrée', 'Annulée'];
    if (!statutsValides.includes(this.statut)) {
      throw new Error('Statut invalide');
    }

    this.public_id = uuidv4();
    this.reference = Commande.genererReferenceCommande();

    const dateCollecteFormatee = Commande.formater_date(this.date_collecte);
    const dateLivraisonFormatee = Commande.formater_date(this.date_livraison);

    const [resultat] = await db.execute(
     `INSERT INTO commandes 
      (public_id, user_id, reference, montant_total, statut, mode_paiement,
       adresse_collecte, adresse_livraison, note_client, date_collecte, date_livraison)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.public_id,
        this.user_id,
        this.reference,
        this.montant_total,
        this.statut,
        this.mode_paiement,
        this.adresse_collecte,
        this.adresse_livraison,
        this.note_client,
        dateCollecteFormatee,
        dateLivraisonFormatee
      ]
    );

    this.id = resultat.insertId;
    return this;
  }

  async updateDateCollecte(date) {
    const dateFormatee = Commande.formater_date(date);
    const [result] = await db.execute(
      `UPDATE commandes SET date_collecte = ?, row_stamp = row_stamp + 1, updated_at = NOW()
       WHERE public_id = ?`,
      [dateFormatee, this.public_id]
    );
    if (result.affectedRows === 0) throw new Error('Commande introuvable');
    this.date_collecte = dateFormatee;
    return this;
  }

  async updateDateLivraison(date) {
    const dateFormatee = Commande.formater_date(date);
    const [result] = await db.execute(
      `UPDATE commandes SET date_livraison = ?, row_stamp = row_stamp + 1, updated_at = NOW()
       WHERE public_id = ?`,
      [dateFormatee, this.public_id]
    );
    if (result.affectedRows === 0) throw new Error('Commande introuvable');
    this.date_livraison = dateFormatee;
    return this;
  }

  async updateStatut(nouveauStatut) {
    const statutsValides = ['En attente', 'Payée', 'En cours', 'Livrée', 'Annulée'];
    if (!statutsValides.includes(nouveauStatut)) throw new Error('Statut invalide');
    const [result] = await db.execute(
      `UPDATE commandes SET statut = ?, row_stamp = row_stamp + 1, updated_at = NOW()
       WHERE public_id = ?`,
      [nouveauStatut, this.public_id]
    );
    if (result.affectedRows === 0) throw new Error('Commande introuvable');
    this.statut = nouveauStatut;
    this.row_stamp++;
    return this;
  }

  async annuler() { return this.updateStatut('Annulée'); }
  async marquerPayee() { return this.updateStatut('Payée'); }
  async marquerLivree() { return this.updateStatut('Livrée'); }

  async getDetails() {
    const [rows] = await db.execute(
        `SELECT dc.*, s.nom as service_nom 
         FROM details_commandes dc
         JOIN services s ON dc.service_id = s.id
         WHERE dc.commande_id = ?`,
        [this.id]
    );
    return rows;  // toujours un tableau
}

  async recalculerTotal() {
    if (!this.id) throw new Error('Commande non encore enregistrée');
    const [rows] = await db.execute(
      `SELECT SUM(quantite * prix_unitaire_scelle) as total 
       FROM details_commands WHERE commande_id = ?`,
      [this.id]
    );
    const nouveauTotal = rows[0].total || 0;
    this.montant_total = nouveauTotal;
    await db.execute(
      `UPDATE commandes SET montant_total = ?, row_stamp = row_stamp + 1, updated_at = NOW()
       WHERE public_id = ?`,
      [nouveauTotal, this.public_id]
    );
    return this;
  }

  // models/commandes.js

  static async findByPublicId(publicId) {
    const [rows] = await db.execute(`
        SELECT c.*, u.nom, u.prenom, u.email, u.telephone
        FROM commandes c
        JOIN users u ON c.user_id = u.id
        WHERE c.public_id = ?
    `, [publicId]);
    return rows[0] ? new Commande(rows[0]) : null;
}

async getDetails() {
  console.log('🔍 getDetails - commande_id:', this.id);
  const [rows] = await db.execute(`
      SELECT * FROM details_commandes WHERE commande_id = ?
  `, [this.id]);
  console.log('📊 Détails trouvés:', rows.length);
  return rows.map(row => new DetailsCommande(row));
}static async findByPublicId(publicId) {
  const [rows] = await db.execute(`
      SELECT c.*, u.nom, u.prenom, u.email, u.telephone
      FROM commandes c
      JOIN users u ON c.user_id = u.id
      WHERE c.public_id = ?
  `, [publicId]);
  return rows[0] ? new Commande(rows[0]) : null;
} static async findAll(limit = 100, offset = 0) {
  const [rows] = await db.execute(`
      SELECT c.*, u.nom, u.prenom, u.email, u.telephone 
      FROM commandes c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
  `, [limit, offset]);
  return rows.map(row => new Commande(row));
}
static async findAllWithClientInfo() {
  const [rows] = await db.execute(`
      SELECT 
          c.public_id as id,
          c.reference,
          c.montant_total as amount,
          c.statut as status,
          c.created_at as depositDate,
          c.date_livraison as expectedDate,
          CONCAT(u.prenom, ' ', u.nom) as client,
          u.telephone as phone
      FROM commandes c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
  `);
  return rows;
}
  static async deleteByPublicId(publicId) {
    const [result] = await db.execute('DELETE FROM commandes WHERE public_id = ?', [publicId]);
    return result.affectedRows > 0;
  }

  static async getStats() {
    const [rows] = await db.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN statut = 'En attente' THEN 1 ELSE 0 END) as en_attente,
        SUM(CASE WHEN statut = 'Payée' THEN 1 ELSE 0 END) as payees,
        SUM(CASE WHEN statut = 'Livrée' THEN 1 ELSE 0 END) as livrees,
        SUM(CASE WHEN statut = 'Annulée' THEN 1 ELSE 0 END) as annulees,
        SUM(CASE WHEN statut IN ('Payée', 'Livrée') THEN montant_total ELSE 0 END) as chiffre_affaires
      FROM commandes
    `);
    const stats = rows[0];
    return {
      total: stats.total,
      en_attente: stats.en_attente,
      payees: stats.payees,
      livrees: stats.livrees,
      annulees: stats.annulees,
      chiffre_affaires: stats.chiffre_affaires || 0
    };
  }

  toJSON() {
    return {
      public_id: this.public_id,
      reference: this.reference,
      montant_total: this.montant_total,
      statut: this.statut,
      mode_paiement: this.mode_paiement,
      adresse_collecte: this.adresse_collecte,
      adresse_livraison: this.adresse_livraison,
      note_client: this.note_client,
      date_collecte: this.date_collecte,
      date_livraison: this.date_livraison,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}