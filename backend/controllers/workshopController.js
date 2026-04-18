import WorkshopSlot from '../models/WorkshopSlot.js';

export const getSlotsByArtist = async (req, res) => {
  try {
    const slots = await WorkshopSlot.find({ artist: req.params.artistId })
      .populate('bookedBy', 'name email')
      .sort('date startTime');
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableSlotsByArtist = async (req, res) => {
  try {
    const slots = await WorkshopSlot.find({
      artist: req.params.artistId,
      isBooked: false,
      isBlocked: false,
      date: { $gte: new Date() },
    }).sort('date startTime');
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSlot = async (req, res) => {
  try {
    const { date, startTime, endTime, maxParticipants, description } = req.body;
    const slot = await WorkshopSlot.create({
      artist: req.user._id,
      date,
      startTime,
      endTime,
      maxParticipants: maxParticipants || 1,
      description,
    });
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSlot = async (req, res) => {
  try {
    const slot = await WorkshopSlot.findOne({ _id: req.params.id, artist: req.user._id });
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.isBooked) return res.status(400).json({ message: 'Cannot update a booked slot' });

    const { date, startTime, endTime, maxParticipants, description, isBlocked } = req.body;
    if (date) slot.date = date;
    if (startTime) slot.startTime = startTime;
    if (endTime) slot.endTime = endTime;
    if (maxParticipants) slot.maxParticipants = maxParticipants;
    if (description !== undefined) slot.description = description;
    if (isBlocked !== undefined) slot.isBlocked = isBlocked;

    await slot.save();
    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSlot = async (req, res) => {
  try {
    const slot = await WorkshopSlot.findOneAndDelete({ _id: req.params.id, artist: req.user._id, isBooked: false });
    if (!slot) return res.status(404).json({ message: 'Slot not found or already booked' });
    res.json({ message: 'Slot deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
