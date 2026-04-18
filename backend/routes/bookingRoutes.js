import express from 'express';
import {
  createBooking, getTouristBookings, getArtistBookings, updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('tourist'), createBooking);
router.get('/my', protect, authorizeRoles('tourist'), getTouristBookings);
router.get('/artist', protect, authorizeRoles('artist'), getArtistBookings);
router.put('/:id/status', protect, authorizeRoles('artist'), updateBookingStatus);

export default router;
