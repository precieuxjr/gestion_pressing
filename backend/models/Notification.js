import db from '../config/db.js';

export default class Notification {
  constructor(data = {}) {
    this.id = data.id;
    this.user_public_id = data.user_public_id;
    this.type = data.type;
    this.title = data.title;
    this.message = data.message;
    this.link = data.link || null;
    this.is_read = data.is_read || 0;
    this.created_at = data.created_at;
  }

  // Créer une notification
  static async create({ user_public_id, type, title, message, link = null }) {
    const [result] = await db.execute(
      `INSERT INTO notifications (user_public_id, type, title, message, link)
       VALUES (?, ?, ?, ?, ?)`,
      [user_public_id, type, title, message, link]
    );
    return result.insertId;
  }

  // Récupérer les notifications non lues d'un utilisateur
  static async getUnreadByUser(userPublicId) {
    const [rows] = await db.execute(
      `SELECT * FROM notifications
       WHERE user_public_id = ? AND is_read = 0
       ORDER BY created_at DESC`,
      [userPublicId]
    );
    return rows;
  }

  // Marquer comme lue
  static async markAsRead(notificationId) {
    await db.execute(
      `UPDATE notifications SET is_read = 1 WHERE id = ?`,
      [notificationId]
    );
  }

  // Marquer toutes comme lues pour un utilisateur
  static async markAllAsRead(userPublicId) {
    await db.execute(
      `UPDATE notifications SET is_read = 1 WHERE user_public_id = ?`,
      [userPublicId]
    );
  }
}