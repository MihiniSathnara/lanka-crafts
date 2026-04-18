import User from '../models/User.js';
import Craft from '../models/Craft.js';
import Booking from '../models/Booking.js';
import Message from '../models/Message.js';
import Review from '../models/Review.js';

export const getAnalytics = async (req, res) => {
  try {
    const [
      totalArtists, totalTourists, totalCrafts,
      totalBookings, confirmedBookings, completedBookings,
      cancelledBookings, totalMessages, totalReviews,
      recentArtists, recentTourists,
    ] = await Promise.all([
      User.countDocuments({ role: 'artist' }),
      User.countDocuments({ role: 'tourist' }),
      Craft.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Message.countDocuments(),
      Review.countDocuments(),
      User.find({ role: 'artist' }).sort('-createdAt').limit(5).select('name email createdAt craftSpecialization'),
      User.find({ role: 'tourist' }).sort('-createdAt').limit(5).select('name email country createdAt'),
    ]);

    res.json({
      totalArtists, totalTourists, totalCrafts,
      totalBookings, confirmedBookings, completedBookings,
      cancelledBookings, totalMessages, totalReviews,
      recentArtists, recentTourists,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
