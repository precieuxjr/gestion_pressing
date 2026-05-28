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
  }

  async enregistrement() {

    if (this.prenom) this.prenom = this.prenom.trim().toLowerCase();
    if (this.nom) this.nom = this.nom.trim().toLowerCase();
    if (this.postnom) this.postnom = this.postnom.trim().toLowerCase();
    if (this.adresse) this.adresse = this.adresse.trim().toLowerCase();
    if (this.email) this.email = this.email.trim().toLowerCase();
    if (this.telephone) this.telephone = this.telephone.trim();

    if (
      !this.prenom ||
      !this.nom ||
      !this.postnom ||
      !this.adresse ||
      !this.email ||
      !this.telephone
    ) {
      throw new Error('veuillez remplir tous les champs !');
    }

    if (this.password.length < 6) {
      throw new Error(
        ' veuillez saisir un mot de passse contenant au moins 6 caractères '
      );
    }

    const [row] = await db.execute('SELECT id FROM users WHERE email = ? ', [
      this.email,
    ]);

    if (row.length > 0) {
      throw new Error('Un compte existe dejà avec cet email ');
    }

    //hash du mot de passe
    const hash_password = await bcrypt.hash(this.password, 10);
   
    // id publique

    this.public_id = uuidv4();

    const [result] = await db.execute(
      `INSERT INTO users 
(public_id, nom, prenom, email, password , telephone, role, adresse) 
VALUES (?, ?, ?, ?, ?, ?, ? ,?)`,
      [
        this.public_id,
        this.nom,
        this.prenom,
        this.email,
        hash_password,
        this.telephone,
        this.role,
        this.adresse
      ]
    );
    delete this.password;
  }
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM users');

    return rows.map((row) => new User(row));
  }

  static async findID(uuid) {
    const [rows] = await db.execute(
      `SELECT nom,prenom,email,telephone,adresse from  users WHERE public_id = ?`,
      [uuid]
    );
    return rows.length < 0 ? new User(rows[0]) : null;
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
    if (!email|| email.trim()==='') {
      throw new Error('email vide : veuillez saisir une email valide');
    }

    const [rows] =await  db.execute(`SELECT * FROM users WHERE email = ?  `, [email]);

    if (rows.length == 0) {
      throw Error("email saisi n'existe pas veuillez saisir un email existant"); 
    }
    return new User(rows[0]);
    
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
  // 1. Validation des entrées
  if (!oldPassword || !newPassword) {
      throw new Error('Ancien et nouveau mot de passe requis');
  }
  if (newPassword.length < 6) {
      throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères');
  }
  if (oldPassword === newPassword) {
      throw new Error('Le nouveau mot de passe doit être différent de l’ancien');
  }

  // 2. Récupérer le mot de passe haché actuel depuis la base
  const [rows] = await db.execute(
      'SELECT password FROM users WHERE public_id = ?',
      [this.public_id]
  );
  if (rows.length === 0) {
      throw new Error('Utilisateur introuvable');
  }

  // 3. Vérifier l'ancien mot de passe
  const isMatch = await bcrypt.compare(oldPassword, rows[0].mot_de_passe);
  if (!isMatch) {
      throw new Error('Ancien mot de passe incorrect');
  }

  // 4. Hacher le nouveau mot de passe
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 5. Mettre à jour en base
  const [result] = await db.execute(
      `UPDATE users SET mot_de_passe = ?, updated_at = NOW() 
       WHERE public_id = ?`,
      [hashedPassword, this.public_id]
  );

  if (result.affectedRows === 0) {
      throw new Error('Échec de la mise à jour du mot de passe');
  }

  // 6. Supprimer la référence en clair dans l'instance si elle existe
  delete this.password;
 
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



}
