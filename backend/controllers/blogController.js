import Blog from '../models/Blog.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

export const getAllBlogs = async (req, res) => {
  try {
    const { tab, search } = req.query;
    const filter = { isPublished: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { workshopName: { $regex: search, $options: 'i' } },
        { workshopLocation: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let sort = '-createdAt';
    if (tab === 'liked') sort = '-likes';

    const blogs = await Blog.find(filter)
      .populate('author', 'name avatar country')
      .sort(sort)
      .lean();

    const blogsWithCount = blogs.map(b => ({ ...b, likesCount: b.likes.length }));
    res.json(blogsWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name avatar country');
    if (!blog || !blog.isPublished) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogsByAuthor = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId, isPublished: true })
      .populate('author', 'name avatar country')
      .sort('-createdAt')
      .lean();
    res.json(blogs.map(b => ({ ...b, likesCount: b.likes.length })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .sort('-createdAt')
      .lean();
    res.json(blogs.map(b => ({ ...b, likesCount: b.likes.length })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, workshopName, workshopLocation, tags, isPublished } = req.body;

    let coverImage = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'lankacrafts/blogs');
      coverImage = result.secure_url;
    }

    const blog = await Blog.create({
      author: req.user._id,
      title,
      content,
      excerpt: excerpt || '',
      coverImage,
      workshopName: workshopName || '',
      workshopLocation: workshopLocation || '',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean)) : [],
      isPublished: isPublished !== 'false',
    });

    const populated = await Blog.findById(blog._id).populate('author', 'name avatar country');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const { title, content, excerpt, workshopName, workshopLocation, tags, isPublished } = req.body;
    if (title !== undefined) blog.title = title;
    if (content !== undefined) {
      blog.content = content;
      blog.excerpt = excerpt || content.replace(/<[^>]+>/g, '').substring(0, 160).trim();
    }
    if (workshopName !== undefined) blog.workshopName = workshopName;
    if (workshopLocation !== undefined) blog.workshopLocation = workshopLocation;
    if (tags !== undefined) blog.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean);
    if (isPublished !== undefined) blog.isPublished = isPublished !== 'false' && isPublished !== false;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'lankacrafts/blogs');
      blog.coverImage = result.secure_url;
    }

    await blog.save();
    const populated = await Blog.findById(blog._id).populate('author', 'name avatar country');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const userId = req.user._id.toString();
    const idx = blog.likes.findIndex(id => id.toString() === userId);
    if (idx === -1) blog.likes.push(req.user._id);
    else blog.likes.splice(idx, 1);

    await blog.save();
    res.json({ likes: blog.likes.length, liked: idx === -1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrendingTags = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).select('tags').lean();
    const tagCount = {};
    blogs.forEach(b => b.tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
    const sorted = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag, count]) => ({ tag, count }));
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopContributors = async (req, res) => {
  try {
    const agg = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$author', posts: { $sum: 1 }, totalLikes: { $sum: { $size: '$likes' } } } },
      { $sort: { posts: -1, totalLikes: -1 } },
      { $limit: 5 },
    ]);
    const Blog2 = Blog;
    const populated = await Blog2.populate(agg, { path: '_id', select: 'name avatar country', model: 'User' });
    res.json(populated.map(a => ({ user: a._id, posts: a.posts, totalLikes: a.totalLikes })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
