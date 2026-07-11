import express from 'express';
import { getProviderProfile, toggleFavorite, getFavorites } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/provider/:id', getProviderProfile);
router.post('/favorites/:id', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

export default router;
