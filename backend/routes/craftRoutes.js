import express from 'express';
import {
  getAllCrafts, getCraftById, getCraftsByArtist,
  createCraft, updateCraft, deleteCraft,
} from '../controllers/craftController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllCrafts);
router.get('/artist/:artistId', getCraftsByArtist);
router.get('/:id', getCraftById);

router.post('/', protect, authorizeRoles('artist'), upload.array('images', 5), createCraft);
router.put('/:id', protect, authorizeRoles('artist'), upload.array('images', 5), updateCraft);
router.delete('/:id', protect, authorizeRoles('artist'), deleteCraft);

export default router;
