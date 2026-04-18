import express from 'express';
import {
  getSlotsByArtist, getAvailableSlotsByArtist,
  createSlot, updateSlot, deleteSlot,
} from '../controllers/workshopController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/artist/:artistId', getSlotsByArtist);
router.get('/artist/:artistId/available', getAvailableSlotsByArtist);

router.post('/', protect, authorizeRoles('artist'), createSlot);
router.put('/:id', protect, authorizeRoles('artist'), updateSlot);
router.delete('/:id', protect, authorizeRoles('artist'), deleteSlot);

export default router;
