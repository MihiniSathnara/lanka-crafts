import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import { getIO } from '../socket/index.js';

export const getOrCreateChat = async (req, res) => {
  const { artistId, craftId } = req.body;
  try {
    let chat = await Chat.findOne({ tourist: req.user._id, artist: artistId })
      .populate('tourist', 'name avatar')
      .populate('artist', 'name avatar');

    if (!chat) {
      chat = await Chat.create({ tourist: req.user._id, artist: artistId, craft: craftId || null });
      chat = await Chat.findById(chat._id)
        .populate('tourist', 'name avatar')
        .populate('artist', 'name avatar');
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserChats = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'tourist') query.tourist = req.user._id;
    else if (req.user.role === 'artist') query.artist = req.user._id;

    const chats = await Chat.find(query)
      .populate('tourist', 'name avatar')
      .populate('artist', 'name avatar')
      .populate('craft', 'title images')
      .sort('-lastMessageAt');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const isParticipant = chat.tourist.toString() === req.user._id.toString() ||
                          chat.artist.toString() === req.user._id.toString();
    if (!isParticipant) return res.status(403).json({ message: 'Access denied' });

    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name avatar role')
      .sort('createdAt');

    await Message.updateMany(
      { chat: req.params.chatId, sender: { $ne: req.user._id }, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const { content } = req.body;
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const isParticipant = chat.tourist.toString() === req.user._id.toString() ||
                          chat.artist.toString() === req.user._id.toString();
    if (!isParticipant) return res.status(403).json({ message: 'Access denied' });

    const message = await Message.create({
      chat: chat._id,
      sender: req.user._id,
      content,
    });

    chat.lastMessage = content;
    chat.lastMessageAt = new Date();
    await chat.save();

    const populated = await Message.findById(message._id).populate('sender', 'name avatar role');

    const io = getIO();
    const recipientId = chat.tourist.toString() === req.user._id.toString()
      ? chat.artist.toString()
      : chat.tourist.toString();
    io.to(recipientId).emit('newMessage', { chatId: chat._id, message: populated });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
