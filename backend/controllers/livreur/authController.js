import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../../models/users.js';

export const loginLivreur = async (req, res) => {
  try {
    
    const { email, password } = req.body;
    console.log(' Tentative de login livreur :', req.body.email);
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = await User.findByEmail(email);
    console.log('📌 Livreur trouvé :', user ? 'oui' : 'non');
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    if (user.role !== 'livreur') {
      return res.status(403).json({ error: 'Accès réservé aux livreurs' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // ✅ Générer le token avec prenom et nom
    const token = jwt.sign(
      {
        public_id: user.public_id,
        email: user.email,
        role: user.role,
        prenom: user.prenom,
        nom: user.nom
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        public_id: user.public_id,
        email: user.email,
        role: user.role,
        prenom: user.prenom,
        nom: user.nom
      }
    });
  } catch (error) {
    console.error('❌ Erreur loginLivreur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};