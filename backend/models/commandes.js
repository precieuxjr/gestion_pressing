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
    this.livreur_id = data.livreur_id || null;
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
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `CMD-${annee}${mois}${jour}-${random}`;
  }

  async Commander() {
    if (!this.user_id)
      throw new Error("l'identifiant utilisateur est requis !");
    if (!this.adresse_collecte)
      throw new Error("l'adresse de collecte est requis !");
    if (!this.adresse_livraison)
      throw new Error("l'adresse de livraison est requis !");

    const statutsValides = ['En attente', 'Payée', 'Annulée', 'Prêt', 'Retirer', 'Livrée'];
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
        dateLivraisonFormatee,
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
    const statutsValides = ['En attente', 'Payée', 'Annulée', 'Prêt', 'Retirer', 'Livrée'];
    if (!statutsValides.includes(nouveauStatut))
      throw new Error('Statut invalide');
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

  async getDetails() {
    const [rows] = await db.execute(
      `SELECT dc.*, s.nom as service_nom 
         FROM details_commandes dc
         JOIN services s ON dc.service_id = s.id
         WHERE dc.commande_id = ?`,
      [this.id]
    );
    return rows; // toujours un tableau
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
    const [rows] = await db.execute(
      `
        SELECT c.*, u.nom, u.prenom, u.email, u.telephone
        FROM commandes c
        JOIN users u ON c.user_id = u.id
        WHERE c.public_id = ?
    `,
      [publicId]
    );
    return rows[0] ? new Commande(rows[0]) : null;
  }

  async getDetails() {
    console.log('🔍 getDetails - commande_id:', this.id);
    const [rows] = await db.execute(
      `
      SELECT * FROM details_commandes WHERE commande_id = ?
  `,
      [this.id]
    );
    console.log('📊 Détails trouvés:', rows.length);
    return rows.map((row) => new DetailsCommande(row));
  }
  static async findByPublicId(publicId) {
    const [rows] = await db.execute(
      `
      SELECT c.*, u.nom, u.prenom, u.email, u.telephone
      FROM commandes c
      JOIN users u ON c.user_id = u.id
      WHERE c.public_id = ?
  `,
      [publicId]
    );
    return rows[0] ? new Commande(rows[0]) : null;
  }
  static async findAll(limit = 100, offset = 0) {
    const [rows] = await db.execute(
      `
      SELECT c.*, u.nom, u.prenom, u.email, u.telephone 
      FROM commandes c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
  `,
      [limit, offset]
    );
    return rows.map((row) => new Commande(row));
  }

  // Récupérer toutes les commandes avec les informations de livraison
  static async findAllWithLivraisonInfo() {
    const [rows] = await db.execute(`
      SELECT 
          c.public_id as id,
          c.reference,
          c.montant_total as amount,
          c.statut as status,
          c.created_at as depositDate,
          c.date_livraison as expectedDate,
          CONCAT(u.prenom, ' ', u.nom) as client,
          u.telephone as phone,
          c.adresse_collecte,
          c.adresse_livraison,
          c.livreur_id,
          c.statut_livraison,
          (SELECT CONCAT(prenom, ' ', nom) FROM users WHERE id = c.livreur_id) as livreur_nom
      FROM commandes c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
  `);
    return rows;
  }

  // Récupérer une commande avec ses infos de livraison par son public_id
  static async findByIdWithLivraison(publicId) {
    const [rows] = await db.execute(
      `
      SELECT 
          c.*,
          CONCAT(u.prenom, ' ', u.nom) as client,
          u.telephone as phone,
          (SELECT CONCAT(prenom, ' ', nom) FROM users WHERE id = c.livreur_id) as livreur_nom
      FROM commandes c
      JOIN users u ON c.user_id = u.id
      WHERE c.public_id = ?
  `,
      [publicId]
    );
    return rows[0] ? new Commande(rows[0]) : null;
  }

  async assignerLivreur(livreurPublicId) {
    // Récupérer l'ID numérique du livreur
    const [rows] = await db.execute(
      'SELECT id FROM users WHERE public_id = ?',
      [livreurPublicId]
    );
    if (rows.length === 0) throw new Error('Livreur introuvable');
    const livreurIdNum = rows[0].id;
  
    const [result] = await db.execute(
      `UPDATE commandes 
       SET livreur_id = ?, statut_livraison = 'En cours', updated_at = NOW() 
       WHERE public_id = ?`,
      [livreurIdNum, this.public_id]
    );
    if (result.affectedRows === 0) throw new Error("Échec de l'assignation");
    this.livreur_id = livreurIdNum;
    this.statut_livraison = 'En cours';
    return this;
  }
  async assignerLivreur(livreurPublicId) {
    // Récupérer l'ID numérique du livreur
    const [rows] = await db.execute(
      'SELECT id FROM users WHERE public_id = ?',
      [livreurPublicId]
    );
    if (rows.length === 0) throw new Error('Livreur introuvable');
    const livreurIdNum = rows[0].id;
  
    const [result] = await db.execute(
      `UPDATE commandes 
       SET livreur_id = ?, statut_livraison = 'En cours', updated_at = NOW() 
       WHERE public_id = ?`,
      [livreurIdNum, this.public_id]
    );
    if (result.affectedRows === 0) throw new Error("Échec de l'assignation");
    this.livreur_id = livreurIdNum;
    this.statut_livraison = 'En cours';
    return this;
  }
  // Mettre à jour le statut de livraison
  async updateStatutLivraison(nouveauStatut) {
    const statutsValides = [
      'En attente',
      'Collectée',
      'En cours',
      'Livrée',
      'Annulée',
    ];
    if (!statutsValides.includes(nouveauStatut)) {
      throw new Error('Statut de livraison invalide');
    }
    const [result] = await db.execute(
      `UPDATE commandes SET statut_livraison = ?, updated_at = NOW() WHERE public_id = ?`,
      [nouveauStatut, this.public_id]
    );
    if (result.affectedRows === 0) throw new Error('Échec de la mise à jour');
    this.statut_livraison = nouveauStatut;
    return this;
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
          u.telephone as phone,
          c.adresse_collecte,
          c.adresse_livraison,
          c.livreur_id,
          c.statut_livraison,
          (SELECT CONCAT(prenom, ' ', nom) FROM users WHERE id = c.livreur_id) as livreur_nom,
          (SELECT GROUP_CONCAT(DISTINCT s.nom SEPARATOR ', ') 
           FROM details_commandes dc 
           JOIN services s ON dc.service_id = s.id 
           WHERE dc.commande_id = c.id) as service_nom
      FROM commandes c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
  `);
    return rows;
  }
  static async deleteByPublicId(publicId) {
    const [result] = await db.execute(
      'DELETE FROM commandes WHERE public_id = ?',
      [publicId]
    );
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
      chiffre_affaires: stats.chiffre_affaires || 0,
    };
  }

  // Récupérer les commandes avec les informations de livraison, avec filtre optionnel sur le statut
  static async findAllWithLivraisonInfo(statut = null) {
    const params = [];
    let sql = `
      SELECT 
          c.public_id as id,
          c.reference,
          c.montant_total as amount,
          c.statut as status,
          c.created_at as depositDate,
          c.date_livraison as expectedDate,
          CONCAT(u.prenom, ' ', u.nom) as client,
          u.telephone as phone,
          c.adresse_collecte,
          c.adresse_livraison,
          c.livreur_id,
          c.statut_livraison,
          (SELECT CONCAT(prenom, ' ', nom) FROM users WHERE id = c.livreur_id) as livreur_nom
      FROM commandes c
      JOIN users u ON c.user_id = u.id
  `;
    if (statut) {
      sql += ` WHERE c.statut = ?`;
      params.push(statut);
    }
    sql += ` ORDER BY c.created_at DESC`;
    const [rows] = await db.execute(sql, params);
    return rows;
  }
  // models/commande.js
static async findByLivreurId(livreurPublicId) {
  // Récupérer l'ID numérique du livreur à partir de son public_id
  const [rows] = await db.execute(
    'SELECT id FROM users WHERE public_id = ?',
    [livreurPublicId]
  );
  if (rows.length === 0) return []; // Livreur introuvable

  const livreurIdNum = rows[0].id;

  const [commandes] = await db.execute(`
    SELECT 
      c.public_id as id,
      c.reference,
      c.montant_total as amount,
      c.statut as status,
      c.created_at as depositDate,
      c.date_livraison as expectedDate,
      CONCAT(u.prenom, ' ', u.nom) as client,
      u.telephone as phone,
      c.adresse_collecte,
      c.adresse_livraison,
      c.livreur_id,
      c.statut_livraison,
      (SELECT CONCAT(prenom, ' ', nom) FROM users WHERE id = c.livreur_id) as livreur_nom
    FROM commandes c
    JOIN users u ON c.user_id = u.id
    WHERE c.livreur_id = ?
    ORDER BY c.created_at DESC
  `, [livreurIdNum]);

  return commandes;
}
  static async getStatsForLivreur(livreurId) {
    const [rows] = await db.execute(
      `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN statut_livraison = 'Livrée' THEN 1 ELSE 0 END) as livrees,
      SUM(CASE WHEN statut_livraison = 'En cours' THEN 1 ELSE 0 END) as en_cours,
      SUM(CASE WHEN statut_livraison = 'Collectée' THEN 1 ELSE 0 END) as collectees,
      SUM(CASE WHEN statut_livraison = 'En attente' THEN 1 ELSE 0 END) as en_attente
    FROM commandes
    WHERE livreur_id = ?
  `,
      [livreurId]
    );
    const stats = rows[0];
    const [caRows] = await db.execute(
      `
    SELECT SUM(montant_total) as chiffre_affaires
    FROM commandes
    WHERE livreur_id = ? AND statut_livraison = 'Livrée'
  `,
      [livreurId]
    );
    return {
      ...stats,
      chiffre_affaires: caRows[0].chiffre_affaires || 0,
    };
  }
  static async countActiveForLivreur(livreurPublicId, isPublicId = true) {
    let idToUse = livreurPublicId;
    if (isPublicId) {
      // Convertir public_id en ID numérique
      const [rows] = await db.execute(
        'SELECT id FROM users WHERE public_id = ?',
        [livreurPublicId]
      );
      if (rows.length === 0) throw new Error('Livreur introuvable');
      idToUse = rows[0].id;
    }
    const [rows] = await db.execute(
      `SELECT COUNT(*) as count FROM commandes 
       WHERE livreur_id = ? 
       AND statut_livraison IN ('En cours', 'Collectée')`,
      [idToUse]
    );
    return rows[0].count;
  }


// models/commandes.js
async desassigner() {
  if (!this.livreur_id) {
    throw new Error('Cette commande n\'est pas assignée à un livreur');
  }
  // Récupérer le public_id du livreur à partir de l'ID numérique
  const livreurIdNum = this.livreur_id;
  const [rows] = await db.execute(
    'SELECT public_id FROM users WHERE id = ?',
    [livreurIdNum]
  );
  const livreurPublicId = rows.length > 0 ? rows[0].public_id : null;

  const [result] = await db.execute(
    `UPDATE commandes 
     SET livreur_id = NULL, statut_livraison = 'En attente', updated_at = NOW() 
     WHERE public_id = ?`,
    [this.public_id]
  );
  if (result.affectedRows === 0) {
    throw new Error('Échec de la désassignation');
  }
  this.livreur_id = null;
  this.statut_livraison = 'En attente';
  return livreurPublicId;
}



// models/commandes.js

/**
 * Récupère toutes les commandes d'un client par son public_id
 * @param {string} userPublicId - UUID du client
 * @returns {Promise<Array>} - Liste des commandes formatées
 */
static async findByUserPublicId(userPublicId) {
  const [rows] = await db.execute(`
    SELECT 
      c.public_id as id,
      c.reference,
      c.montant_total as amount,
      c.statut as status,
      c.created_at as depositDate,
      c.date_livraison as expectedDate,
      c.adresse_collecte,
      c.adresse_livraison,
      c.statut_livraison,
      c.livreur_id,
      (SELECT CONCAT(prenom, ' ', nom) FROM users WHERE id = c.livreur_id) as livreur_nom
    FROM commandes c
    WHERE c.user_id = (SELECT id FROM users WHERE public_id = ?)
    ORDER BY c.created_at DESC
  `, [userPublicId]);
  return rows;
}

/**
 * Vérifie si une commande appartient à un utilisateur donné
 * @param {string} commandePublicId - public_id de la commande
 * @param {string} userPublicId - public_id de l'utilisateur
 * @returns {Promise<boolean>}
 */
static async belongsToUser(commandePublicId, userPublicId) {
  const [rows] = await db.execute(
    `SELECT c.id 
     FROM commandes c
     JOIN users u ON c.user_id = u.id
     WHERE c.public_id = ? AND u.public_id = ?`,
    [commandePublicId, userPublicId]
  );
  return rows.length > 0;
}

/**
 * Récupère les statistiques d'un client
 * @param {string} userPublicId
 * @returns {Promise<Object>}
 */
static async getStatsForUser(userPublicId) {
  const [rows] = await db.execute(`
    SELECT 
      COUNT(*) as total_commandes,
      SUM(CASE WHEN statut = 'Livrée' THEN 1 ELSE 0 END) as livrees,
      SUM(CASE WHEN statut = 'Payée' THEN 1 ELSE 0 END) as payees,
      SUM(CASE WHEN statut = 'Annulée' THEN 1 ELSE 0 END) as annulees,
      SUM(CASE WHEN statut IN ('Livrée', 'Payée') THEN montant_total ELSE 0 END) as total_depense
    FROM commandes
    WHERE user_id = (SELECT id FROM users WHERE public_id = ?)
  `, [userPublicId]);
  return rows[0] || { total_commandes: 0, livrees: 0, payees: 0, annulees: 0, total_depense: 0 };
}

/**
 * Vérifie si la commande peut être annulée (uniquement si payée)
 * @returns {boolean}
 */
peutEtreAnnulee() {
  // Seulement autorisé si le statut est 'Payée'
  return this.statut === 'Payée';
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
      updated_at: this.updated_at,
      livreur_id: this.livreur_id,
    };
  }
}
