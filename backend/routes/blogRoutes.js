import express from 'express';
import {
  getAllBlogs, getBlogById, getBlogsByAuthor, getMyBlogs,
  createBlog, updateBlog, deleteBlog, toggleLike,
  getTrendingTags, getTopContributors,
} from '../controllers/blogController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/tags/trending', getTrendingTags);
router.get('/contributors/top', getTopContributors);
router.get('/author/:userId', getBlogsByAuthor);
router.get('/my', protect, getMyBlogs);
router.get('/:id', getBlogById);

router.post('/', protect, authorizeRoles('tourist'), upload.single('coverImage'), createBlog);
router.put('/:id', protect, authorizeRoles('tourist'), upload.single('coverImage'), updateBlog);
router.delete('/:id', protect, authorizeRoles('tourist'), deleteBlog);
router.post('/:id/like', protect, toggleLike);

export default router;
