import express from 'express';
import { login, register } from '../../controllers/client/AuthController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);   // ← cette ligne doit exister

export default router;