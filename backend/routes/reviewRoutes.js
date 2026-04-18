import express from 'express';
import { getReviewsByArtist, createReview } from '../controllers/reviewController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/artist/:artistId', getReviewsByArtist);
router.post('/', protect, authorizeRoles('tourist'), createReview);

export default router;
