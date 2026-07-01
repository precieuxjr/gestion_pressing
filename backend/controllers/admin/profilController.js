import User from '../../models/users.js';
import Notification from '../../models/Notification.js';
import db from '../../config/db.js';

export const getProfil = async (req, res) => {
  try {
    const user = await User.findByPublicId(req.user.public_id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    const { password, ...profil } = user;
    res.json(profil);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
export const updateProfil = async (req, res) => {
  try {
    const { nom, prenom, postnom, email, telephone, adresse } = req.body;
    const userPublicId = req.user.public_id;

    // 1️⃣ Validation
    if (!nom || !prenom || !email) {
      return res.status(400).json({ message: 'Nom, prénom et email requis' });
    }

    // 2️⃣ Mettre à jour le profil
    const updated = await User.updateProfile(userPublicId, {
      nom, prenom, postnom, email, telephone, adresse,
    });

    // 3️⃣ Récupérer l'utilisateur mis à jour
    const user = await User.findByPublicId(userPublicId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable après mise à jour' });
    }

    // 4️⃣ Récupérer l'instance Socket.IO
    const io = req.app.get('io');

    if (io) {
      // 🔹 Récupérer tous les administrateurs
      const [admins] = await db.execute('SELECT public_id FROM users WHERE role = ?', ['admin']);

      // Message pour les admins
      const adminMessage = `Le profil de ${user.prenom} ${user.nom} (${user.email}) a été mis à jour.`;
      const adminLink = `/admin/clients/${userPublicId}`;

      // 🔔 Notification persistante pour chaque admin
      for (const admin of admins) {
        await Notification.create({
          user_public_id: admin.public_id,
          type: 'profil_updated',
          title: '👤 Profil mis à jour',
          message: adminMessage,
          link: adminLink
        });
      }

      // 📨 Notification persistante pour l'utilisateur lui-même (confirmation)
      await Notification.create({
        user_public_id: userPublicId,
        type: 'profil_updated',
        title: '✅ Votre profil a été mis à jour',
        message: 'Vos informations personnelles ont été modifiées avec succès.',
        link: `/profil`  // À adapter selon votre frontend
      });

      // ⚡ Émettre en temps réel
      const payload = {
        type: 'profil_updated',
        userId: userPublicId,
        updatedFields: { nom, prenom, email, telephone, adresse },
        updatedAt: new Date()
      };

      // Envoyer à l'utilisateur lui-même
      io.to(`user_${userPublicId}`).emit('profil_updated', payload);

      // Envoyer aux admins
      io.to('admins').emit('profil_updated', {
        ...payload,
        adminMessage: `Profil mis à jour par ${req.user.prenom} ${req.user.nom}`
      });

      console.log(`📤 Notifications envoyées pour la mise à jour du profil de ${userPublicId}`);
    }

    // 5️⃣ Réponse HTTP
    res.json({ message: 'Profil mis à jour', data: updated });

  } catch (err) {
    console.error('❌ Erreur updateProfil:', err);
    res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userPublicId = req.user.public_id;

    // 1️⃣ Validation
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Ancien et nouveau mot de passe requis' });
    }

    // 2️⃣ Récupérer l'utilisateur
    const user = await User.findByPublicId(userPublicId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    // 3️⃣ Changer le mot de passe via le modèle
    await user.changePassword(oldPassword, newPassword);

    // 4️⃣ Récupérer l'instance Socket.IO
    const io = req.app.get('io');

    if (io) {
      // 🔹 Récupérer tous les administrateurs
      const [admins] = await db.execute('SELECT public_id FROM users WHERE role = ?', ['admin']);

      // Message pour les admins
      const adminMessage = `Le mot de passe de ${user.prenom} ${user.nom} (${user.email}) a été modifié.`;
      const adminLink = `/admin/clients/${userPublicId}`;

      // 🔔 Notification persistante pour chaque admin
      for (const admin of admins) {
        await Notification.create({
          user_public_id: admin.public_id,
          type: 'password_changed',
          title: '🔑 Mot de passe modifié',
          message: adminMessage,
          link: adminLink
        });
      }

      // 📨 Notification persistante pour l'utilisateur lui-même (confirmation)
      await Notification.create({
        user_public_id: userPublicId,
        type: 'password_changed',
        title: '🔒 Mot de passe mis à jour',
        message: 'Votre mot de passe a été modifié avec succès.',
        link: `/profil`  // À adapter selon votre frontend
      });

      // ⚡ Émettre en temps réel
      const payload = {
        type: 'password_changed',
        userId: userPublicId,
        updatedAt: new Date()
      };

      // Envoyer à l'utilisateur lui-même
      io.to(`user_${userPublicId}`).emit('password_changed', payload);

      // Envoyer aux admins
      io.to('admins').emit('password_changed', {
        ...payload,
        adminMessage: `Mot de passe modifié par ${req.user.prenom} ${req.user.nom}`
      });

      console.log(`📤 Notifications envoyées pour le changement de mot de passe de ${userPublicId}`);
    }

    // 5️⃣ Réponse HTTP
    res.json({ message: 'Mot de passe modifié avec succès' });

  } catch (err) {
    console.error('Erreur changement mot de passe:', err);
    // Déterminer le statut selon le message d'erreur
    const status = err.message.includes('incorrect') ||
                   err.message.includes('requis') ||
                   err.message.includes('différent') ? 400 : 500;
    res.status(status).json({ message: err.message || 'Erreur serveur' });
  }
};
