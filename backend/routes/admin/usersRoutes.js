import express from 'express';
import { verifyToken } from '../../middlewares/auth.js';
import { adminMiddleware } from '../../middlewares/adminMiddleware.js';
import { getAllClients, Inscription,UpdateProfil,deleteClient } from '../../controllers/admin/clientController.js';

const router = express.Router();


router.use(verifyToken, adminMiddleware);
router.get('/', getAllClients);
router.post('/',Inscription);
router.put('/:publicId',UpdateProfil);
router.delete('/:publicId',deleteClient)


export default router;