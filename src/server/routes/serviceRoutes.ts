import express from 'express';
import { getServices, getServiceById, createService, getSuggestions, getPriceTrends } from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/suggestions').get(getSuggestions);
router.route('/trends').get(getPriceTrends);
router.route('/').get(getServices).post(protect, createService);
router.route('/:id').get(getServiceById);

export default router;
