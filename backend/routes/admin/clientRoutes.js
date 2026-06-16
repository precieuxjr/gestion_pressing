import express from 'express';
import { verifyToken } from '../../middlewares/auth.js';
import { adminMiddleware } from '../../middlewares/adminMiddleware.js';
import { getAllClients, } from '../../controllers/admin/clientController.js';

const router = express.Router();


router.use(verifyToken, adminMiddleware);
router.get('/', getAllClients);


export default router;