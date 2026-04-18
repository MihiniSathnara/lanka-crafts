import { useEffect, useState } from 'react';
import { Users, Palette, Calendar, MessageCircle, Star, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api/axios.js';
import Spinner from '../../components/Spinner.jsx';
import { format } from '../../utils/helpers.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics').then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>;

  const statCards = [
    { label: 'Total Artists', value: stats.totalArtists, icon: <Palette size={20} />, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Total Tourists', value: stats.totalTourists, icon: <Users size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Crafts', value: stats.totalCrafts, icon: <Palette size={20} />, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: <Calendar size={20} />, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Total Messages', value: stats.totalMessages, icon: <MessageCircle size={20} />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Total Reviews', value: stats.totalReviews, icon: <Star size={20} />, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform analytics and overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map(({ label, value, icon, color, bg }) => (
          <div key={label} className={`card p-4 text-center ${bg} border-none`}>
            <div className={`flex justify-center mb-2 ${color}`}>{icon}</div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Booking Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Confirmed Bookings', value: stats.confirmedBookings, icon: <CheckCircle size={18} />, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Completed Bookings', value: stats.completedBookings, icon: <TrendingUp size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Cancelled Bookings', value: stats.cancelledBookings, icon: <XCircle size={18} />, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} className={`card p-5 flex items-center gap-4 ${bg} border-none`}>
            <div className={`${color}`}>{icon}</div>
            <div>
              <div className={`text-xl font-bold ${color}`}>{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Artists */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Palette size={18} className="text-orange-500" /> Recent Artists
          </h2>
          {stats.recentArtists?.length === 0 ? (
            <p className="text-gray-400 text-sm">No artists yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentArtists?.map(artist => (
                <div key={artist._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{artist.name}</p>
                    <p className="text-xs text-gray-400">{artist.email}</p>
                    {artist.craftSpecialization?.length > 0 && (
                      <p className="text-xs text-orange-600">{artist.craftSpecialization.slice(0,2).join(', ')}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{format(artist.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tourists */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={18} className="text-blue-500" /> Recent Tourists
          </h2>
          {stats.recentTourists?.length === 0 ? (
            <p className="text-gray-400 text-sm">No tourists yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentTourists?.map(tourist => (
                <div key={tourist._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{tourist.name}</p>
                    <p className="text-xs text-gray-400">{tourist.email}</p>
                    {tourist.country && <p className="text-xs text-blue-600">{tourist.country}</p>}
                  </div>
                  <span className="text-xs text-gray-400">{format(tourist.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 card p-5 bg-gray-50 border-none">
        <p className="text-sm text-gray-500">
          Logged in as <strong className="text-gray-800">{user?.name}</strong> · Admin Account
        </p>
      </div>
    </div>
  );
}
