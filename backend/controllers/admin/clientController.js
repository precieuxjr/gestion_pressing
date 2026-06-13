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