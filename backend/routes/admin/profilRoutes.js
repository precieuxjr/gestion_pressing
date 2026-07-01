import express from 'express';
import { verifyToken } from '../../middlewares/auth.js';
import { adminMiddleware } from '../../middlewares/adminMiddleware.js';
import { getProfil, updateProfil, changePassword } from '../../controllers/admin/profilController.js';

const router = express.Router();

router.use(verifyToken);
router.use(adminMiddleware);

router.get('/profil', getProfil);
router.put('/profil', updateProfil);
router.put('/profil/password', changePassword);

export default router;