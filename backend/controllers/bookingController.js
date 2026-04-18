import Booking from '../models/Booking.js';
import WorkshopSlot from '../models/WorkshopSlot.js';

export const createBooking = async (req, res) => {
  const { artistId, workshopSlotId, craftId, notes } = req.body;
  try {
    const slot = await WorkshopSlot.findById(workshopSlotId);
    if (!slot) return res.status(404).json({ message: 'Workshop slot not found' });
    if (slot.isBooked || slot.isBlocked) return res.status(400).json({ message: 'This slot is not available' });

    const existing = await Booking.findOne({ tourist: req.user._id, workshopSlot: workshopSlotId });
    if (existing) return res.status(400).json({ message: 'You already have a booking for this slot' });

    const booking = await Booking.create({
      tourist: req.user._id,
      artist: artistId,
      workshopSlot: workshopSlotId,
      craft: craftId || null,
      notes,
      qrData: `LANKACRAFTS-BOOKING-${Date.now()}`,
    });

    slot.isBooked = true;
    slot.bookedBy = req.user._id;
    await slot.save();

    const populated = await Booking.findById(booking._id)
      .populate('artist', 'name avatar workshopName')
      .populate('workshopSlot')
      .populate('craft', 'title');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTouristBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tourist: req.user._id })
      .populate('artist', 'name avatar workshopName workshopLocation')
      .populate('workshopSlot')
      .populate('craft', 'title images')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getArtistBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ artist: req.user._id })
      .populate('tourist', 'name email avatar phone')
      .populate('workshopSlot')
      .populate('craft', 'title')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, artist: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    if (status === 'cancelled') {
      const slot = await WorkshopSlot.findById(booking.workshopSlot);
      if (slot) {
        slot.isBooked = false;
        slot.bookedBy = null;
        await slot.save();
      }
    }
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
