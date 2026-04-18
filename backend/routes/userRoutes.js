import express from 'express';
import {
  getProfile, updateProfile, uploadAvatar, deleteAccount,
  getAllArtists, getArtistById,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/artists', getAllArtists);
router.get('/artists/:id', getArtistById);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.delete('/account', protect, deleteAccount);

export default router;
