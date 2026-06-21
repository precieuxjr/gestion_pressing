import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import db from '../config/db.js';

export default class User {
  constructor(data = {}) {
    this.public_id = data.public_id;
    this.nom = data.nom;
    this.postnom = data.postnom;
    this.prenom = data.prenom;
    this.email = data.email;
    this.telephone = data.telephone;
    this.password = data.password;
    this.adresse = data.adresse;
    this.role = data.role || 'client';
    this.email_verifie = data.email_verifie || 0;
    this.statut = data.statut || 'actif';
    this.disponibilite = data.disponibilite || 'Disponible';
  }

  async enregistrement() {
    // 1. Nettoyer les champs
    if (this.prenom) this.prenom = this.prenom.trim().toLowerCase();
    if (this.nom) this.nom = this.nom.trim().toLowerCase();
    if (this.postnom) this.postnom = this.postnom.trim().toLowerCase(); // optionnel
    if (this.adresse) this.adresse = this.adresse.trim().toLowerCase();
    if (this.email) this.email = this.email.trim().toLowerCase();
    if (this.telephone) this.telephone = this.telephone.trim();
  
    // 2. Valeur par défaut pour postnom
    if (!this.postnom) this.postnom = '';
  
    // 3. Validation des champs OBLIGATOIRES (sans postnom)
    if (!this.prenom || !this.nom || !this.adresse || !this.email || !this.telephone) {
      throw new Error('veuillez remplir tous les champs obligatoires !');
    }
  
    // 4. Vérification de la longueur du mot de passe
    if (this.password.length < 6) {
      throw new Error('le mot de passe doit contenir au moins 6 caractères');
    }
  
    // 5. Vérifier si l'email existe déjà
    const [row] = await db.execute('SELECT id FROM users WHERE email = ?', [this.email]);
    if (row.length > 0) {
      throw new Error('Un compte existe déjà avec cet email');
    }
  
    // 6. Hasher le mot de passe
    const hash_password = await bcrypt.hash(this.password, 10);
    this.public_id = uuidv4();
  
    // 7. Insertion (avec postnom)
    const [result] = await db.execute(
      `INSERT INTO users 
       (public_id, nom, prenom, email, password, telephone, role, adresse, postnom) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.public_id,
        this.nom,
        this.prenom,
        this.email,
        hash_password,
        this.telephone,
        this.role,
        this.adresse,
        this.postnom   // ← ajout de postnom
      ]
    );
    delete this.password;
  }
  // models/users.js
static async findById(identifier) {
  // Si identifier ressemble à un UUID (contient des tirets), chercher par public_id
  if (typeof identifier === 'string' && identifier.includes('-')) {
    const [rows] = await db.execute(
      `SELECT id, public_id, nom, prenom, email, telephone, adresse, disponibilite, role
       FROM users 
       WHERE public_id = ?`,
      [identifier]
    );
    return rows[0] || null;
  } else {
    // Sinon, chercher par id numérique
    const [rows] = await db.execute(
      `SELECT id, public_id, nom, prenom, email, telephone, adresse, disponibilite, role
       FROM users 
       WHERE id = ?`,
      [Number(identifier)]
    );
    return rows[0] || null;
  }
}



  static async findID(uuid) {
    const [rows] = await db.execute(
      `SELECT nom,prenom,email,telephone,adresse from  users WHERE public_id = ?`,
      [uuid]
    );
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  static async findByPublicId(publicId) {
    const [rows] = await db.execute('SELECT * FROM users WHERE public_id = ?', [
      publicId,
    ]);
    return rows.length ? new User(rows[0]) : null;
  }

  toJSON() {
    return {
      public_id: this.public_id,
      nom: this.nom,
      postnom: this.postnom,
      prenom: this.prenom,
      email: this.email,
      telephone: this.telephone,
      adresse: this.adresse,
      role: this.role,
      email_verifie: this.email_verifie,
      statut: this.statut,
      created_at: this.created_at,
    };
  }

  static async findByEmail(email) {
    if (!email) return null;
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );
    return rows.length > 0 ? rows[0] : null;
  }
  static async findAllClients() {
    const [rows] = await db.execute(
        `SELECT public_id, nom, postnom, prenom, email, telephone, adresse, 
                role, email_verifie, statut, created_at 
         FROM users 
         WHERE role = 'client' 
         ORDER BY created_at DESC`
    );
    return rows.map(row => new User(row));
}




async changePassword(oldPassword, newPassword) {
  if (!oldPassword || !newPassword) {
      throw new Error('Ancien et nouveau mot de passe requis');
  }
  if (newPassword.length < 6) {
      throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères');
  }
  if (oldPassword === newPassword) {
      throw new Error('Le nouveau mot de passe doit être différent de l’ancien');
  }

  const [rows] = await db.execute(
      'SELECT password FROM users WHERE public_id = ?',  // ← corrigé : password au lieu de mot_de_passe
      [this.public_id]
  );
  if (rows.length === 0) {
      throw new Error('Utilisateur introuvable');
  }

  const isMatch = await bcrypt.compare(oldPassword, rows[0].password);  // ← corrigé
  if (!isMatch) {
      throw new Error('Ancien mot de passe incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const [result] = await db.execute(
      `UPDATE users SET password = ?, updated_at = NOW() WHERE public_id = ?`,  // ← corrigé
      [hashedPassword, this.public_id]
  );

  if (result.affectedRows === 0) {
      throw new Error('Échec de la mise à jour du mot de passe');
  }

  delete this.password;
  return true;
}

// Récupérer tous les livreurs avec leur disponibilité
static async findAllLivreurs() {
  const [rows] = await db.execute(
      `SELECT public_id, nom, prenom, telephone, email, disponibilite
       FROM users
       WHERE role = 'livreur'
       ORDER BY nom ASC`
  );
  return rows;
}

// Récupérer uniquement les livreurs disponibles
// models/users.js
static async findAvailableLivreurs() {
  const [rows] = await db.execute(`
    SELECT 
        u.public_id,
        u.nom,
        u.prenom,
        u.telephone,
        u.disponibilite,
        (SELECT COUNT(*) 
         FROM commandes c 
         WHERE c.livreur_id = u.id 
           AND c.statut_livraison IN ('En cours', 'Collectée')
        ) AS commandes_actives
    FROM users u
    WHERE u.role = 'livreur'
      AND u.disponibilite IN ('Disponible', 'En livraison')   -- ← doit contenir 'En livraison'
      AND (SELECT COUNT(*) 
           FROM commandes c 
           WHERE c.livreur_id = u.id 
             AND c.statut_livraison IN ('En cours', 'Collectée')
          ) < 5
    ORDER BY u.nom ASC
  `);
  return rows;
}
// Mettre à jour la disponibilité d'un livreur
// models/users.js
static async updateDisponibilite(publicId, statut) {
  const statutsValides = ['Disponible', 'En livraison', 'Indisponible'];
  if (!statutsValides.includes(statut)) {
    throw new Error('Statut de disponibilité invalide');
  }
  const [result] = await db.execute(
    `UPDATE users SET disponibilite = ?, updated_at = NOW() WHERE public_id = ?`,
    [statut, publicId]
  );
  if (result.affectedRows === 0) throw new Error('Utilisateur introuvable');
  return true;
}

async desactiverCompte() {
  if (!this.public_id) {
      throw new Error('Utilisateur non identifié (public_id manquant)');
  }
  const [result] = await db.execute(
      `UPDATE users SET statut = 'inactif', updated_at = NOW() 
       WHERE public_id = ? AND statut != 'inactif'`,
      [this.public_id]
  );
  if (result.affectedRows === 0) {
      throw new Error('Compte déjà inactif ou introuvable');
  }
  this.statut = 'inactif';
  return this;
}



static async searchByNom(terme) {
  if (!terme || terme.trim() === '') {
      throw new Error('Veuillez fournir un terme de recherche');
  }

  const [rows] = await db.execute(
      `SELECT public_id, nom, postnom, prenom, email, telephone, adresse, 
              role, email_verifie, statut, created_at 
       FROM users 
       WHERE role = 'client' 
         AND (nom LIKE ? OR prenom LIKE ? OR postnom LIKE ?)
       ORDER BY nom ASC`,
      [`%${terme}%`, `%${terme}%`, `%${terme}%`]
  );

  return rows.map(row => new User(row));
}


async reactiverCompte() {
  // Vérifier que l'utilisateur a un public_id
  if (!this.public_id) {
      throw new Error('Utilisateur non identifié (public_id manquant)');
  }

  const [result] = await db.execute(
      `UPDATE users 
       SET statut = 'actif', updated_at = NOW() 
       WHERE public_id = ? AND statut = 'inactif'`,
      [this.public_id]
  );

  if (result.affectedRows === 0) {
      throw new Error('Impossible de réactiver : le compte est déjà actif ou n\'existe pas');
  }

  // Mettre à jour l'instance courante
  this.statut = 'actif';
  
  return this;
}


static async getPublicIdByEmail(email) {
  const user = await this.findByEmail(email);
  return user ? user.public_id : null;
}





static async findAvailableLivreurs() {
  const [rows] = await db.execute(`
    SELECT 
        u.id,                        -- on garde l'id numérique si besoin
        u.public_id,
        u.nom,
        u.prenom,
        u.telephone,
        u.disponibilite
    FROM users u                     -- ← alias 'u' sur la table principale
    WHERE u.role = 'livreur' 
      AND u.disponibilite IN ('Disponible', 'En livraison')
      AND (SELECT COUNT(*) 
           FROM commandes c 
           WHERE c.livreur_id = u.id  -- ← maintenant 'u.id' est valide
             AND c.statut_livraison IN ('En cours', 'Collectée')
          ) < 5
    ORDER BY u.nom ASC
  `);
  return rows;
}

// Récupérer tous les livreurs (admin)
static async findAllLivreurs() {
  const [rows] = await db.execute(
      `SELECT id, public_id, nom, prenom, telephone, email, adresse, disponibilite
       FROM users
       WHERE role = 'livreur'
       ORDER BY nom ASC`
  );
  return rows;
}
// Mettre à jour la disponibilité d'un livreur en utilisant le public_id (UUID)
static async updateDisponibilite(publicId, statut) {
  const statutsValides = ['Disponible', 'En livraison', 'Indisponible'];
  if (!statutsValides.includes(statut)) {
      throw new Error('Statut de disponibilité invalide');
  }
  const [result] = await db.execute(
      `UPDATE users SET disponibilite = ?, updated_at = NOW() WHERE public_id = ?`,
      [statut, publicId]
  );
  if (result.affectedRows === 0) throw new Error('Utilisateur introuvable');
  return true;
}




// models/users.js

/**
 * Met à jour le profil d'un utilisateur (champs de base)
 * @param {string} publicId - UUID de l'utilisateur
 * @param {Object} data - { nom, prenom, telephone, adresse }
 * @returns {Promise<Object>} - L'utilisateur mis à jour (sans mot de passe)
 */
static async updateProfile(publicId, data) {
  const { nom, prenom, telephone, adresse } = data;
  await db.execute(
    `UPDATE users 
     SET nom = ?, prenom = ?, telephone = ?, adresse = ?, updated_at = NOW()
     WHERE public_id = ?`,
    [nom, prenom, telephone, adresse, publicId]
  );
  // Retourner l'utilisateur mis à jour sans le mot de passe
  const updated = await this.findByPublicId(publicId);
  if (updated) delete updated.password;
  return updated;
}




}



