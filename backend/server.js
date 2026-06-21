import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import adminCommandeRoutes from './routes/admin/commandeRoutes.js';
import clientRoutes from './routes/admin/clientRoutes.js';
import servicesRoutes from './routes/admin/servicesRoutes.js';
import paiementRoutes from './routes/admin/paiementRoutes.js';
import livraisonRoutes from './routes/admin/livraisonRoutes.js';
import livreurRoutes from './routes/livreur/commandesRoutes.js';
import authRoutes from './routes/client/authRoutes.js';

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
/*client */
app.use('/api/auth', authRoutes);

/*========= */

app.use('/api/livreur', livreurRoutes);


// Route d'authentification (avant le 404)
app.use('/api/auth', authRoutes);
app.use('/api/admin/commandes', adminCommandeRoutes);
app.use('/api/admin/clients', clientRoutes);
app.use ('/api/admin/services',servicesRoutes);
app.use('/api/admin/paiements', paiementRoutes);
app.use('/api/admin/livraisons', livraisonRoutes);

// ⚠️ Middleware 404 – doit être APRÈS toutes les routes
app.use((req, res) => {
  res.status(404).json({ message: "Désolé, cette page n'existe pas JR." });
});

// Gestion globale des erreurs (optionnel mais recommandé)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

const PORT = process.env.PORT  ;
app.listen(PORT, () => {
  console.log(`Serveur en ligne sur http://localhost:${PORT}`);
});
