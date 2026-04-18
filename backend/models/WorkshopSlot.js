import mongoose from 'mongoose';

const workshopSlotSchema = new mongoose.Schema(
  {
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    maxParticipants: { type: Number, default: 1 },
    isBooked: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const WorkshopSlot = mongoose.model('WorkshopSlot', workshopSlotSchema);
export default WorkshopSlot;
