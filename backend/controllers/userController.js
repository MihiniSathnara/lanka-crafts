import User from '../models/User.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'country', 'nic_passport',
      'bio', 'craftSpecialization', 'address', 'workshopName', 'workshopLocation'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image provided' });
  try {
    const result = await uploadToCloudinary(req.file.buffer, 'lankacrafts/avatars');
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true }
    ).select('-password');
    res.json({ avatar: user.avatar, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllArtists = async (req, res) => {
  try {
    const artists = await User.find({ role: 'artist' }).select('-password');
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getArtistById = async (req, res) => {
  try {
    const artist = await User.findOne({ _id: req.params.id, role: 'artist' }).select('-password');
    if (!artist) return res.status(404).json({ message: 'Artist not found' });
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
