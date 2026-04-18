import express from 'express';
import {
  getOrCreateChat, getUserChats, getMessages, sendMessage,
} from '../controllers/chatController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('tourist'), getOrCreateChat);
router.get('/', protect, getUserChats);
router.get('/:chatId/messages', protect, getMessages);
router.post('/:chatId/messages', protect, sendMessage);

export default router;
