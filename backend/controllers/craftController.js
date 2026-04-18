import Craft from '../models/Craft.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

export const getAllCrafts = async (req, res) => {
  try {
    const crafts = await Craft.find({ isAvailable: true })
      .populate('artist', 'name avatar craftSpecialization workshopName')
      .sort('-createdAt');
    res.json(crafts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCraftById = async (req, res) => {
  try {
    const craft = await Craft.findById(req.params.id)
      .populate('artist', 'name avatar craftSpecialization workshopName bio');
    if (!craft) return res.status(404).json({ message: 'Craft not found' });
    res.json(craft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCraftsByArtist = async (req, res) => {
  try {
    const crafts = await Craft.find({ artist: req.params.artistId })
      .populate('artist', 'name avatar');
    res.json(crafts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCraft = async (req, res) => {
  try {
    const { title, description, materials, price, quantity, category } = req.body;
    const images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'lankacrafts/crafts');
        images.push(result.secure_url);
      }
    }

    const craft = await Craft.create({
      artist: req.user._id,
      title,
      description,
      materials: Array.isArray(materials) ? materials : materials?.split(',').map(m => m.trim()) || [],
      price: Number(price) || 0,
      quantity: Number(quantity) || 1,
      category,
      images,
    });

    const populated = await craft.populate('artist', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCraft = async (req, res) => {
  try {
    const craft = await Craft.findOne({ _id: req.params.id, artist: req.user._id });
    if (!craft) return res.status(404).json({ message: 'Craft not found' });

    const { title, description, materials, price, quantity, category, isAvailable } = req.body;
    if (title) craft.title = title;
    if (description) craft.description = description;
    if (materials) craft.materials = Array.isArray(materials) ? materials : materials.split(',').map(m => m.trim());
    if (price !== undefined) craft.price = Number(price);
    if (quantity !== undefined) craft.quantity = Number(quantity);
    if (category) craft.category = category;
    if (isAvailable !== undefined) craft.isAvailable = isAvailable;

    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'lankacrafts/crafts');
        newImages.push(result.secure_url);
      }
      craft.images = [...craft.images, ...newImages];
    }

    await craft.save();
    res.json(craft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCraft = async (req, res) => {
  try {
    const craft = await Craft.findOneAndDelete({ _id: req.params.id, artist: req.user._id });
    if (!craft) return res.status(404).json({ message: 'Craft not found' });
    res.json({ message: 'Craft deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
