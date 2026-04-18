import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { User, Palette, Calendar, MessageCircle, ArrowRight } from 'lucide-react';
import api from '../../api/axios.js';

export default function ArtistDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ crafts: 0, bookings: 0, chats: 0 });

  useEffect(() => {
    Promise.all([
      api.get(`/crafts/artist/${user._id}`),
      api.get('/bookings/artist'),
      api.get('/chats'),
    ]).then(([c, b, ch]) => {
      setStats({ crafts: c.data.length, bookings: b.data.length, chats: ch.data.length });
    }).catch(() => {});
  }, []);

  const cards = [
    { to: '/artist/profile', icon: <User size={24} className="text-orange-500" />, title: 'My Profile', desc: 'Update bio, location, specialization', bg: 'bg-orange-50', stat: null },
    { to: '/artist/crafts', icon: <Palette size={24} className="text-purple-500" />, title: 'Craft Management', desc: 'Add, edit, and manage craft items', bg: 'bg-purple-50', stat: `${stats.crafts} items` },
    { to: '/artist/availability', icon: <Calendar size={24} className="text-blue-500" />, title: 'Workshop Availability', desc: 'Manage workshop time slots', bg: 'bg-blue-50', stat: null },
    { to: '/artist/chats', icon: <MessageCircle size={24} className="text-green-500" />, title: 'Tourist Messages', desc: 'Reply to tourist inquiries', bg: 'bg-green-50', stat: `${stats.chats} chats` },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Artist Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name?.split(' ')[0]}! Manage your craft business here.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {cards.map(({ to, icon, title, desc, bg, stat }) => (
          <Link key={to} to={to} className={`card p-6 ${bg} border-none hover:shadow-md transition-shadow group`}>
            <div className="flex items-start justify-between mb-3">
              {icon}
              {stat && <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-0.5 rounded-full">{stat}</span>}
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{desc}</p>
            <div className="flex items-center text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">
              Manage <ArrowRight size={14} className="ml-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Crafts', value: stats.crafts, color: 'text-purple-600' },
          { label: 'Total Bookings', value: stats.bookings, color: 'text-blue-600' },
          { label: 'Active Chats', value: stats.chats, color: 'text-green-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-5 text-center">
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
