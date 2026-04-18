import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    workshopName: { type: String, default: '' },
    workshopLocation: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

blogSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/<[^>]+>/g, '').substring(0, 160).trim();
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
