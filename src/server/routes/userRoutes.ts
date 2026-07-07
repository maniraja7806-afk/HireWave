import express from 'express';
import { getProviderProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/provider/:id', getProviderProfile);

export default router;
