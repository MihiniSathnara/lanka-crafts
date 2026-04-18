import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api/axios.js';
import Spinner from '../../components/Spinner.jsx';
import { Calendar, BookOpen, Star, Clock, ChevronRight, ExternalLink, Heart, ChevronLeft } from 'lucide-react';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const STATUS_COLORS = {
  confirmed: 'bg-green-500',
  pending: 'bg-amber-500',
  completed: 'bg-blue-500',
  cancelled: 'bg-red-400',
};

const INTEREST_COLORS = ['bg-amber-100 text-amber-800', 'bg-orange-100 text-orange-800', 'bg-rose-100 text-rose-800', 'bg-teal-100 text-teal-800'];

export default function TouristDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapArtists, setMapArtists] = useState([]);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get('/bookings/my').catch(() => ({ data: [] })),
      api.get('/blogs/my').catch(() => ({ data: [] })),
      api.get('/crafts').catch(() => ({ data: [] })),
      api.get('/map').catch(() => ({ data: [] })),
    ]).then(([bk, bl, cr, mp]) => {
      setBookings(bk.data || []);
      setMyBlogs(bl.data || []);
      setWorkshops(cr.data?.slice(0, 6) || []);
      setMapArtists(mp.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const attended = bookings.filter(b => b.status === 'completed').length;
  const reviewsGiven = 0;

  const stats = [
    { label: 'Workshops Attended', value: attended, icon: <BookOpen size={18} className="text-amber-600" /> },
    { label: 'Blogs Posted', value: myBlogs.length, icon: <Star size={18} className="text-amber-600" /> },
    { label: 'Reviews Given', value: reviewsGiven, icon: <Star size={18} className="text-amber-600" /> },
    { label: 'Upcoming Bookings', value: upcoming.length, icon: <Calendar size={18} className="text-amber-600" /> },
  ];

  const interests = user?.interests?.length ? user.interests : ['Pottery', 'Mask Making'];

  const visibleSlides = upcoming.slice(slideIdx, slideIdx + 3);
  const canPrev = slideIdx > 0;
  const canNext = slideIdx + 3 < upcoming.length;

  if (loading) return <div className="py-32 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Welcome banner */}
        <div className="relative bg-[#7C2D12] rounded-2xl overflow-hidden p-6 text-white">
          {/* Decorative dots pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-amber-300 text-sm font-medium mb-1">Your Cultural Journey Continues</p>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <BookOpen size={12} /> {attended} Workshops
                </span>
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Star size={12} /> {myBlogs.length} Blogs
                </span>
                {user?.country && (
                  <span className="text-xs bg-white/10 px-3 py-1 rounded-full">🌍 {user.country}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-amber-300 font-semibold uppercase tracking-wide mb-2">Your Interests</p>
              <div className="flex flex-wrap gap-1.5 justify-end">
                {interests.map((interest, i) => (
                  <span key={interest} className="text-xs bg-amber-500/30 text-amber-100 px-2.5 py-1 rounded-full font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-2">{icon}</div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Upcoming workshops */}
        {upcoming.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Your Upcoming Workshops</h2>
                <p className="text-xs text-gray-500">Don't miss these scheduled sessions</p>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/tourist/bookings" className="text-sm text-amber-600 hover:underline font-medium">View All</Link>
                <div className="flex gap-1">
                  <button onClick={() => setSlideIdx(i => i - 1)} disabled={!canPrev}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-amber-50 disabled:opacity-30 transition-colors">
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={() => setSlideIdx(i => i + 1)} disabled={!canNext}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-amber-50 disabled:opacity-30 transition-colors">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {visibleSlides.map((booking, i) => (
                <div key={booking._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative">
                  {i === 0 && (
                    <span className="absolute top-2 left-2 z-10 text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">NEXT UP</span>
                  )}
                  <span className={`absolute top-2 right-2 z-10 text-xs font-semibold text-white px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[booking.status] || 'bg-gray-400'}`}>
                    {booking.status}
                  </span>
                  <div className="h-32 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden">
                    {booking.artist?.avatar ? (
                      <img src={booking.artist.avatar} alt={booking.artist?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center text-2xl font-bold text-amber-700">
                        {booking.artist?.name?.[0] || 'A'}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-gray-900 text-sm truncate">{booking.artist?.workshopName || booking.artist?.name}</p>
                    <p className="text-xs text-amber-700 truncate">{booking.artist?.name}</p>
                    {booking.workshopSlot && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Calendar size={11} />
                        {new Date(booking.workshopSlot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map + Quick links */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-50">
              <h2 className="font-bold text-gray-900 text-base">Discover Workshops Near You</h2>
              <p className="text-xs text-gray-500">Plan your experience around Sri Lanka</p>
            </div>
            <div style={{ height: '260px' }}>
              <MapContainer center={[7.8731, 80.7718]} zoom={7} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {mapArtists.filter(a => a.workshopLocation?.lat && a.workshopLocation?.lng).map(artist => (
                  <Marker key={artist._id} position={[artist.workshopLocation.lat, artist.workshopLocation.lng]}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{artist.workshopName || artist.name}</p>
                        <p className="text-gray-500 text-xs">{artist.craftSpecialization?.join(', ')}</p>
                        <Link to={`/artists/${artist._id}`} className="text-amber-600 text-xs hover:underline flex items-center gap-1 mt-1">
                          View Profile <ExternalLink size={10} />
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 text-base mb-4">Quick Links</h2>
            <div className="space-y-2">
              {[
                { to: '/tourist/profile', label: 'Edit Profile', icon: '👤' },
                { to: '/tourist/bookings', label: 'My Bookings', icon: '📅' },
                { to: '/tourist/blogs', label: 'My Blogs', icon: '📝' },
                { to: '/tourist/chats', label: 'Messages', icon: '💬' },
                { to: '/workshops', label: 'Book a Workshop', icon: '🎨' },
                { to: '/blogs', label: 'Cultural Stories', icon: '🌏' },
              ].map(({ to, label, icon }) => (
                <Link key={to} to={to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50 transition-colors group">
                  <span className="text-base">{icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-amber-700 transition-colors">{label}</span>
                  <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-amber-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended For You */}
        {workshops.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recommended For You</h2>
                <p className="text-xs text-gray-500">Based on your interests</p>
              </div>
              <Link to="/crafts" className="text-sm text-amber-600 hover:underline font-medium">Explore All</Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workshops.slice(0, 3).map(craft => (
                <Link key={craft._id} to={`/crafts/${craft._id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                  <div className="h-36 overflow-hidden relative">
                    {craft.images?.[0] ? (
                      <img src={craft.images[0]} alt={craft.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-3xl">🎨</div>
                    )}
                    {craft.category && (
                      <span className="absolute top-2 left-2 text-xs font-semibold bg-amber-500 text-white px-2 py-0.5 rounded-full">{craft.category}</span>
                    )}
                    <button className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Heart size={13} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sm text-gray-900 truncate">{craft.title}</p>
                    <p className="text-xs text-amber-700">{craft.artist?.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-0.5"><Star size={11} className="text-amber-500 fill-amber-500" /> 4.9 (128)</span>
                      <span className="text-sm font-bold text-amber-700">${craft.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent blogs */}
        {myBlogs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">My Recent Posts</h2>
              <Link to="/tourist/blogs" className="text-sm text-amber-600 hover:underline font-medium">Manage All</Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBlogs.slice(0, 3).map(blog => (
                <div key={blog._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                  {blog.coverImage && (
                    <div className="h-28 overflow-hidden">
                      <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col">
                    {blog.workshopName && (
                      <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mb-2 self-start">{blog.workshopName}</span>
                    )}
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 flex-1">{blog.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                      <Link to={`/tourist/blogs/${blog._id}/edit`} className="text-xs text-gray-400 hover:text-amber-600 transition-colors flex items-center gap-1">
                        Edit <ChevronRight size={11} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
