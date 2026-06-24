import express from 'express';
import { loginLivreur } from '../../../controllers/livreur/authController.js';

const router = express.Router();

// Route de connexion publique (pas de middleware d'authentification)
router.post('/login', loginLivreur);

export default router;