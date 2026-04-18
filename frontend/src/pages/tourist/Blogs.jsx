import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PenSquare, Trash2, Pencil, Eye, ArrowLeft, ImagePlus, X } from 'lucide-react';
import api from '../../api/axios.js';
import Spinner from '../../components/Spinner.jsx';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../utils/helpers.js';

/* ─── Blog list ───────────────────────────────────────────────────────────── */
export function TouristBlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/blogs/my').then(({ data }) => setBlogs(data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Post deleted');
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  if (loading) return <div className="py-20 text-center"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Blogs</h1>
          <p className="text-gray-500 text-sm mt-0.5">Share your cultural experiences</p>
        </div>
        <Link to="/tourist/blogs/new"
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
          <PenSquare size={16} /> Write New Post
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
          <PenSquare size={40} className="mx-auto mb-3 text-amber-200" />
          <p className="text-gray-500 font-medium mb-1">No posts yet</p>
          <p className="text-sm text-gray-400 mb-5">Share your workshop experience with the community</p>
          <Link to="/tourist/blogs/new" className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            <PenSquare size={16} /> Write First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map(blog => (
            <div key={blog._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4 items-start hover:shadow-md transition-shadow">
              {blog.coverImage && (
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900 truncate">{blog.title}</h3>
                    {blog.workshopName && (
                      <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {blog.workshopName}{blog.workshopLocation ? ` · ${blog.workshopLocation}` : ''}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                {blog.excerpt && <p className="text-sm text-gray-400 mt-1 line-clamp-1">{blog.excerpt}</p>}
                <div className="flex items-center gap-1 mt-1">
                  {blog.tags?.slice(0, 3).map(t => <span key={t} className="text-xs text-gray-400">#{t}</span>)}
                </div>
                <p className="text-xs text-gray-400 mt-1">{new Date(blog.createdAt).toLocaleDateString()} · {blog.likesCount ?? blog.likes?.length ?? 0} likes</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to={`/blogs/${blog._id}`}
                  className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="View">
                  <Eye size={16} />
                </Link>
                <Link to={`/tourist/blogs/${blog._id}/edit`}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                  <Pencil size={16} />
                </Link>
                <button onClick={() => handleDelete(blog._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Blog form (create + edit) ───────────────────────────────────────────── */
export function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ title: '', content: '', workshopName: '', workshopLocation: '', tags: '', isPublished: true });
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/blogs/${id}`)
      .then(({ data }) => {
        setForm({
          title: data.title,
          content: data.content,
          workshopName: data.workshopName || '',
          workshopLocation: data.workshopLocation || '',
          tags: data.tags?.join(', ') || '',
          isPublished: data.isPublished,
        });
        if (data.coverImage) setPreview(data.coverImage);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('coverImage', file);

      if (isEdit) {
        await api.put(`/blogs/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Post updated!');
      } else {
        await api.post('/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Post published!');
      }
      navigate('/tourist/blogs');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/tourist/blogs" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Post' : 'Write New Post'}</h1>
          <p className="text-sm text-gray-500">{isEdit ? 'Update your cultural story' : 'Share your experience with the community'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        {/* Cover image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
          {preview ? (
            <div className="relative rounded-xl overflow-hidden h-48 bg-gray-50">
              <img src={preview} alt="Cover" className="w-full h-full object-cover" />
              <button type="button" onClick={() => { setPreview(''); setFile(null); if (!isEdit) {} }}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1.5 shadow">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current.click()}
              className="h-40 border-2 border-dashed border-amber-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/40 transition-colors bg-amber-50/20"
            >
              <ImagePlus size={28} className="text-amber-300 mb-2" />
              <p className="text-sm text-gray-500 font-medium">Click to upload cover image</p>
              <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button type="button" onClick={() => fileRef.current.click()} className="mt-2 text-xs text-amber-600 hover:underline">
            {preview ? 'Change image' : ''}
          </button>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title <span className="text-red-400">*</span></label>
          <input
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Give your story a title..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50 focus:bg-white transition-colors"
          />
        </div>

        {/* Workshop context */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Workshop Name</label>
            <input
              value={form.workshopName}
              onChange={e => setForm(p => ({ ...p, workshopName: e.target.value }))}
              placeholder="e.g. Batik Textiles"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
            <input
              value={form.workshopLocation}
              onChange={e => setForm(p => ({ ...p, workshopLocation: e.target.value }))}
              placeholder="e.g. Kandy, Colombo"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Story <span className="text-red-400">*</span></label>
          <textarea
            value={form.content}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            placeholder="Share your experience in detail — what you learned, what surprised you, how it felt..."
            rows={10}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50 focus:bg-white transition-colors resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label>
          <input
            value={form.tags}
            onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
            placeholder="Batik, Kandy, Pottery — comma separated"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50 focus:bg-white transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={e => setForm(p => ({ ...p, isPublished: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-amber-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
          </label>
          <div>
            <p className="text-sm font-medium text-gray-700">Publish immediately</p>
            <p className="text-xs text-gray-400">Uncheck to save as draft</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm">
            {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Publish Post'}
          </button>
          <Link to="/tourist/blogs"
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm text-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
