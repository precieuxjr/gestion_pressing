import  User  from '../../models/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default  async function login(req, res) {
    try {
        const { email, password } = req.body;

        // 1. Validation des entrées
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        // 2. Récupérer l'utilisateur par email (inclut le mot de passe haché)
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // 3. Vérifier que le compte est actif
        if (user.statut !== 'actif') {
            return res.status(403).json({ error: 'Compte désactivé. Contactez l\'administrateur.' });
        }

        // 4. Vérifier le mot de passe (il faut avoir le hash en mémoire)
        //    La méthode findByEmail doit sélectionner la colonne mot_de_passe.
        //    Si ce n'est pas le cas, il faudra faire une requête supplémentaire.
        //    Ici on suppose que user.mot_de_passe contient le hash.
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

            // 5. Générer un token JWT
            const token = jwt.sign(
                { 
                    public_id: user.public_id,
                    email: user.email,
                    role: user.role,
                    prenom: user.prenom,
                    nom: user.nom
                },
                process.env.JWT_SECRET,   // variable d'environnement
                { expiresIn: '4h' }
            );

        // 6. Réponse (ne pas renvoyer le mot de passe)
        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                public_id: user.public_id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}