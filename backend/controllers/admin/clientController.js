import User from '../../models/users.js';

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
    const { nom,postnom, prenom, telephone, adresse, role } = req.body;

    console.log('🔍 publicId extrait :', publicId);

    const updated = await User.updateProfile(publicId, { nom , postnom, prenom, telephone, adresse, role });
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


