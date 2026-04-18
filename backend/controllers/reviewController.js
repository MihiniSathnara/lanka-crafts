import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

export const getReviewsByArtist = async (req, res) => {
  try {
    const reviews = await Review.find({ artist: req.params.artistId })
      .populate('tourist', 'name avatar country')
      .sort('-createdAt');

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, total: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  const { artistId, bookingId, rating, comment } = req.body;
  try {
    const existing = await Review.findOne({ tourist: req.user._id, artist: artistId, booking: bookingId });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this booking' });

    if (bookingId) {
      const booking = await Booking.findOne({ _id: bookingId, tourist: req.user._id, status: 'completed' });
      if (!booking) return res.status(400).json({ message: 'Booking not found or not completed' });
    }

    const review = await Review.create({
      tourist: req.user._id,
      artist: artistId,
      booking: bookingId || null,
      rating,
      comment,
    });

    const populated = await Review.findById(review._id).populate('tourist', 'name avatar country');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
