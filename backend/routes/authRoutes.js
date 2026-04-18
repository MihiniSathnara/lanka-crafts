import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, adminRegister } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['tourist', 'artist']).withMessage('Role must be tourist or artist'),
], register);

router.post('/admin-register', adminRegister);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
