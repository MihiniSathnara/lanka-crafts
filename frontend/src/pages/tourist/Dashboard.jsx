import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { User, Calendar, MessageCircle, ArrowRight } from 'lucide-react';

export default function TouristDashboard() {
  const { user } = useAuth();

  const cards = [
    { to: '/tourist/profile', icon: <User size={24} className="text-orange-500" />, title: 'My Profile', desc: 'View and update your profile information', bg: 'bg-orange-50' },
    { to: '/tourist/bookings', icon: <Calendar size={24} className="text-blue-500" />, title: 'My Bookings', desc: 'View your workshop bookings and QR codes', bg: 'bg-blue-50' },
    { to: '/tourist/chats', icon: <MessageCircle size={24} className="text-green-500" />, title: 'My Chats', desc: 'Conversations with artists', bg: 'bg-green-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Explore crafts, manage bookings, and chat with artists.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {cards.map(({ to, icon, title, desc, bg }) => (
          <Link key={to} to={to} className={`card p-6 ${bg} border-none hover:shadow-md transition-shadow group`}>
            <div className="mb-3">{icon}</div>
            <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{desc}</p>
            <div className="flex items-center text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">
              Go <ArrowRight size={14} className="ml-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <h2 className="font-bold text-gray-800 mb-3">Discover More</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/crafts" className="btn-primary text-sm">Browse Crafts</Link>
          <Link to="/artists" className="btn-secondary text-sm">Find Artists</Link>
          <Link to="/workshops" className="btn-secondary text-sm">Book Workshop</Link>
          <Link to="/map" className="btn-secondary text-sm">View Map</Link>
        </div>
      </div>
    </div>
  );
}
