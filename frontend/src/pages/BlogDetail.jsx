import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, MapPin, Calendar, Tag, Pencil } from 'lucide-react';
import api from '../api/axios.js';
import Spinner from '../components/Spinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const FLAG_MAP = { 'Sri Lanka': '🇱🇰', 'United States': '🇺🇸', 'UK': '🇬🇧', 'Australia': '🇦🇺', 'India': '🇮🇳', 'Germany': '🇩🇪', 'France': '🇫🇷', 'Japan': '🇯🇵' };

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    api.get(`/blogs/${id}`)
      .then(({ data }) => {
        setBlog(data);
        setLikesCount(data.likes?.length ?? 0);
        if (user) setLiked(data.likes?.includes(user._id) || data.likes?.some(l => l === user._id || l?._id === user._id));
      })
      .catch(() => navigate('/blogs'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleLike = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await api.post(`/blogs/${id}/like`);
      setLiked(data.liked);
      setLikesCount(data.likes);
    } catch {}
  };

  if (loading) return <div className="py-32 text-center"><Spinner size="lg" /></div>;
  if (!blog) return null;

  const isAuthor = user && blog.author?._id === user._id;

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      {/* Cover image */}
      {blog.coverImage && (
        <div className="h-64 md:h-80 overflow-hidden">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back */}
        <Link to="/blogs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-700 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Cultural Stories
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Workshop badge */}
          {(blog.workshopName || blog.workshopLocation) && (
            <div className="flex items-center gap-1.5 mb-4">
              <MapPin size={14} className="text-amber-600" />
              <span className="text-sm font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                {blog.workshopName}{blog.workshopLocation ? ` — ${blog.workshopLocation}` : ''}
              </span>
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{blog.title}</h1>

          {/* Author row */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img
                src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author?.name || 'U')}&background=c2410c&color=fff&size=40`}
                alt={blog.author?.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-100"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {blog.author?.name}
                  {blog.author?.country && <span className="ml-1.5 text-base">{FLAG_MAP[blog.author.country] || '🌍'}</span>}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar size={12} />
                  {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAuthor && (
                <Link to={`/tourist/blogs/${blog._id}/edit`}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                  <Pencil size={14} /> Edit
                </Link>
              )}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-colors border ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400'}`}
              >
                <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
                Helpful ({likesCount})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">
            {blog.content}
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-gray-100">
              <Tag size={14} className="text-gray-400" />
              {blog.tags.map(tag => (
                <Link key={tag} to={`/blogs?search=${encodeURIComponent(tag)}`}
                  className="text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full transition-colors">
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Back button */}
        <div className="mt-6 text-center">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-700 transition-colors">
            <ArrowLeft size={15} /> View all Cultural Stories
          </Link>
        </div>
      </div>
    </div>
  );
}
