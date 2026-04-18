import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    craft: { type: mongoose.Schema.Types.ObjectId, ref: 'Craft', default: null },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

chatSchema.index({ tourist: 1, artist: 1 }, { unique: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
