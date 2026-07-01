import User from '../../models/users.js';
import Notification from '../../models/Notification.js';
import db from '../../config/db.js';

export const getAllClients = async (req, res) => {
  try {
    const clients = await User.findAllClients();  // utilise ta méthode existante dans User.js
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};




export const Inscription = async (req,res) =>{

  try{
    const { nom, prenom, postnom, email, telephone, adresse, role = 'client',password } = req.body;

    if (!nom || !prenom || !email || !telephone || !password) {
      return res.status(400).json({ 
        error: 'Nom, prénom, email, téléphone et mot de passe sont requis.' 
      });
    }
    const user = new User({
      nom,
      prenom,
      postnom,
      email,
      telephone,
      adresse,
      role
    });
    await user.enregistrement(password);
    res.status(201).json({
      message: 'Client créé avec succès',
      user: user.toJSON() // toJSON() ne contient pas le mot de passe
    });


  }
  catch  (error) {


  
      console.error('Erreur createClient:', error);
      res.status(400).json({ error: error.message });
    }
  }

// Récupérer un client par son public_id
export const getClientById = async (req, res) => {
  try {
    const { publicId } = req.params;
    const client = await User.findByPublicId(publicId);
    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
export const UpdateProfil = async (req, res) => {
  try {
    console.log('📥 Params reçus :', req.params);
    console.log('📥 Body reçu :', req.body);

    const { publicId } = req.params;
    const { nom, postnom, prenom, telephone, adresse, role } = req.body;

    console.log('🔍 publicId extrait :', publicId);

    // 1️⃣ Mettre à jour le client
    const updated = await User.updateProfile(publicId, { nom, postnom, prenom, telephone, adresse, role });

    // 2️⃣ Récupérer le client pour avoir ses infos avant/après
    const client = await User.findByPublicId(publicId);
    if (!client) {
      return res.status(404).json({ error: 'Client introuvable après mise à jour' });
    }

    // 3️⃣ Récupérer l'instance Socket.IO
    const io = req.app.get('io');

    if (io) {
      // 🔹 Récupérer tous les administrateurs
      const [admins] = await db.execute('SELECT public_id FROM users WHERE role = ?', ['admin']);

      // Message pour les admins
      const adminMessage = `Le profil du client ${client.prenom} ${client.nom} (${client.email}) a été mis à jour par l'administrateur ${req.user.prenom} ${req.user.nom}.`;
      const adminLink = `/admin/clients/${publicId}`;

      // 🔔 Notification persistante pour chaque admin
      for (const admin of admins) {
        await Notification.create({
          user_public_id: admin.public_id,
          type: 'client_updated',
          title: '👤 Client mis à jour',
          message: adminMessage,
          link: adminLink
        });
      }

      // 📨 Notification persistante pour le client lui-même
      await Notification.create({
        user_public_id: publicId,
        type: 'client_updated',
        title: '👤 Votre profil a été mis à jour',
        message: `Votre profil a été modifié par l'administrateur ${req.user.prenom} ${req.user.nom}.`,
        link: `/client/profil`
      });

      // ⚡ Émettre en temps réel
      const payload = {
        type: 'client_updated',
        clientId: publicId,
        updatedFields: { nom, prenom, telephone, adresse, role },
        updatedAt: new Date()
      };

      // Envoyer au client
      io.to(`user_${publicId}`).emit('client_updated', payload);

      // Envoyer aux admins
      io.to('admins').emit('client_updated', {
        ...payload,
        adminMessage: `Profil client mis à jour par ${req.user.prenom} ${req.user.nom}`
      });

      console.log(`📤 Notifications envoyées pour la mise à jour du profil du client ${publicId}`);
    }

    // 4️⃣ Réponse HTTP
    res.json({ message: 'Client mis à jour avec succès', user: updated });

  } catch (error) {
    console.error('❌ Erreur updateProfil:', error);
    res.status(500).json({ error: error.message });
  }
};
// Supprimer un client (admin)
export const deleteClient = async (req, res) => {
  try {
    const { publicId } = req.params;
    await User.delete(publicId);
    res.json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


