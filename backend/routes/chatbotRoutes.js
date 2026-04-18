import express from 'express';
import { getAllQA, searchQA } from '../controllers/chatbotController.js';

const router = express.Router();

router.get('/', getAllQA);
router.get('/search', searchQA);

export default router;
