import express from 'express';
import { getAnalytics, getAllUsers } from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/analytics', protect, authorizeRoles('admin'), getAnalytics);
router.get('/users', protect, authorizeRoles('admin'), getAllUsers);

export default router;
