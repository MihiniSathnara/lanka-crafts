import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workshopSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkshopSlot', required: true },
    craft: { type: mongoose.Schema.Types.ObjectId, ref: 'Craft', default: null },
    status: {
      type: String,
      enum: ['confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    qrData: { type: String },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
