import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/admin/authRoutes.js';
import adminCommandeRoutes from './routes/admin/commandeRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());    

// Routes publiques
app.get('/backend', (req, res) => {
  res.json({
    message: "Bienvenue sur l'API du Pressing !"
  });
});

// Route d'authentification (avant le 404)
app.use('/api/auth', authRoutes);
app.use('/api/admin/commandes', adminCommandeRoutes);


// ⚠️ Middleware 404 – doit être APRÈS toutes les routes
app.use((req, res) => {
  res.status(404).json({ message: "Désolé, cette page n'existe pas." });
});

// Gestion globale des erreurs (optionnel mais recommandé)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en ligne sur http://localhost:${PORT}`);
});
