import express from 'express';

import login from '../../controllers/admin/AuthController.js';

const router = express.Router();
console.log(' Routeur admin auth chargé');
router.post('/', login);

export default router;
