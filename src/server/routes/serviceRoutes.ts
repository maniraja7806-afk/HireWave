import express from 'express';
import { getServices, getServiceById, createService } from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getServices).post(protect, createService);
router.route('/:id').get(getServiceById);

export default router;
