import mongoose from 'mongoose';

const chatbotQASchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'general' },
    keywords: [{ type: String }],
  },
  { timestamps: true }
);

const ChatbotQA = mongoose.model('ChatbotQA', chatbotQASchema);
export default ChatbotQA;
