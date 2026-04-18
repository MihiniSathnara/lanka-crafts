import mongoose from 'mongoose';

const craftSchema = new mongoose.Schema(
  {
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    materials: [{ type: String }],
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    category: { type: String, default: '' },
  },
  { timestamps: true }
);

const Craft = mongoose.model('Craft', craftSchema);
export default Craft;
