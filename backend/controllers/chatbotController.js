import ChatbotQA from '../models/ChatbotQA.js';

export const getAllQA = async (req, res) => {
  try {
    const qaList = await ChatbotQA.find().sort('category');
    res.json(qaList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchQA = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const terms = q.toLowerCase().split(' ').filter(Boolean);
    const all = await ChatbotQA.find();
    const scored = all.map((qa) => {
      const text = `${qa.question} ${qa.keywords.join(' ')}`.toLowerCase();
      const score = terms.filter((t) => text.includes(t)).length;
      return { ...qa.toObject(), score };
    }).filter((qa) => qa.score > 0).sort((a, b) => b.score - a.score);
    res.json(scored.slice(0, 3));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
