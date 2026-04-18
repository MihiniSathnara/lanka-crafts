import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, PenSquare, MapPin, Hash, Trophy, Search } from 'lucide-react';
import api from '../api/axios.js';
import Spinner from '../components/Spinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const FLAG_MAP = { 'Sri Lanka': '🇱🇰', 'United States': '🇺🇸', 'UK': '🇬🇧', 'Australia': '🇦🇺', 'India': '🇮🇳', 'Germany': '🇩🇪', 'France': '🇫🇷', 'Japan': '🇯🇵' };

function BlogCard({ blog, onLike }) {
  const { user } = useAuth();
  const liked = user && blog.likes?.includes(user._id);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      {blog.coverImage && (
        <Link to={`/blogs/${blog._id}`}>
          <div className="h-48 overflow-hidden">
            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        </Link>
      )}
      <div className="p-5">
        {(blog.workshopName || blog.workshopLocation) && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
              {blog.workshopName}{blog.workshopLocation ? ` — ${blog.workshopLocation}` : ''}
            </span>
          </div>
        )}
        <Link to={`/blogs/${blog._id}`} className="block mb-2 group">
          <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">{blog.title}</h3>
        </Link>
        {blog.excerpt && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{blog.excerpt}</p>
        )}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {blog.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">#{tag}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <img
              src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author?.name || 'U')}&background=c2410c&color=fff&size=32`}
              alt={blog.author?.name}
              className="w-7 h-7 rounded-full object-cover"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">{blog.author?.name?.split(' ')[0]}</span>
              {blog.author?.country && (
                <span className="text-xs text-gray-400 ml-1">{FLAG_MAP[blog.author.country] || '🌍'}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <button
              onClick={() => onLike(blog._id)}
              className={`flex items-center gap-1 text-sm transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
            >
              <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
              <span>{blog.likesCount ?? blog.likes?.length ?? 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Blogs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchBlogs = async (currentTab, currentSearch) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentTab === 'liked') params.set('tab', 'liked');
      if (currentSearch) params.set('search', currentSearch);
      const { data } = await api.get(`/blogs?${params.toString()}`);
      setBlogs(data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchBlogs(tab, search);
  }, [tab, search]);

  useEffect(() => {
    api.get('/blogs/tags/trending').then(({ data }) => setTrendingTags(data)).catch(() => {});
    api.get('/blogs/contributors/top').then(({ data }) => setContributors(data)).catch(() => {});
  }, []);

  const handleLike = async (blogId) => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await api.post(`/blogs/${blogId}/like`);
      setBlogs(prev => prev.map(b =>
        b._id === blogId
          ? { ...b, likesCount: data.likes, likes: data.liked ? [...(b.likes || []), user._id] : (b.likes || []).filter(id => id !== user._id) }
          : b
      ));
    } catch {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setTab('all');
  };

  const TABS = [
    { id: 'all', label: 'All' },
    { id: 'recent', label: 'Most Recent' },
    { id: 'liked', label: 'Most Liked' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      {/* Header */}
      <div className="bg-[#FAF8F4] border-b border-amber-100 px-4 py-8">
        <div className="max-w-6xl mx-auto flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cultural Stories</h1>
            <p className="text-gray-500 mt-1 text-sm">Shared by our community of explorers</p>
          </div>
          {user?.role === 'tourist' && (
            <Link to="/tourist/blogs/new"
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm">
              <PenSquare size={16} /> Share Your Experience
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-5 flex gap-2 max-w-md">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search posts, tags, workshops..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors">
            Search
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setSearchInput(''); }} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-200 transition-colors">
              Clear
            </button>
          )}
        </form>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-white rounded-xl p-1 w-fit shadow-sm border border-gray-100">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-amber-600 text-white' : 'text-gray-600 hover:text-amber-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Blog grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="py-20 text-center"><Spinner size="lg" /></div>
            ) : blogs.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <PenSquare size={40} className="mx-auto mb-3 opacity-40" />
                <p className="font-medium">No posts yet</p>
                {user?.role === 'tourist' && (
                  <Link to="/tourist/blogs/new" className="mt-3 inline-block text-amber-600 hover:underline text-sm">Be the first to share!</Link>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {blogs.map(blog => (
                  <BlogCard key={blog._id} blog={blog} onLike={handleLike} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-5">
            {/* Trending Topics */}
            {trendingTags.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Hash size={16} className="text-amber-600" />
                  <h3 className="font-bold text-gray-800 text-sm">Trending Topics</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {trendingTags.map(({ tag }) => (
                    <button
                      key={tag}
                      onClick={() => { setSearchInput(tag); setSearch(tag); setTab('all'); }}
                      className="text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-full transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Top Contributors */}
            {contributors.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy size={16} className="text-amber-600" />
                  <h3 className="font-bold text-gray-800 text-sm">Top Contributors</h3>
                  <span className="text-xs text-gray-400 ml-auto">This page</span>
                </div>
                <div className="space-y-3">
                  {contributors.map((c, i) => (
                    <div key={c.user?._id} className="flex items-center gap-2">
                      <img
                        src={c.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.name || 'U')}&background=c2410c&color=fff&size=32`}
                        alt={c.user?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{c.user?.name?.split(' ')[0] || 'User'}</p>
                        <p className="text-xs text-gray-400">{c.posts} post{c.posts !== 1 ? 's' : ''}</p>
                      </div>
                      {i === 0 && <span className="text-xs font-bold text-amber-600">#1</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
