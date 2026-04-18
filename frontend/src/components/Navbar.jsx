import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Menu, X, LogOut, User, LayoutDashboard, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setOpen(false);
  };

  const dashboardPath = user?.role === 'tourist' ? '/tourist/dashboard'
    : user?.role === 'artist' ? '/artist/dashboard'
    : '/admin/dashboard';

  const navLink = 'text-gray-700 hover:text-orange-600 font-medium transition-colors text-sm';
  const activeLink = 'text-orange-600 font-semibold';

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Palette className="text-orange-500" size={28} />
            <span className="text-xl font-bold text-gray-900">Lanka<span className="text-orange-500">Crafts</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/crafts" className={({ isActive }) => isActive ? activeLink : navLink}>Craft List</NavLink>
            <NavLink to="/artists" className={({ isActive }) => isActive ? activeLink : navLink}>Artist List</NavLink>
            <NavLink to="/map" className={({ isActive }) => isActive ? activeLink : navLink}>Sri Lanka Map</NavLink>
            <NavLink to="/workshops" className={({ isActive }) => isActive ? activeLink : navLink}>Workshop Booking</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to={dashboardPath} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-600">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f97316&color=fff`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium">
                  <LogOut size={16} />Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/register" className="btn-secondary text-sm py-2 px-4">Register</Link>
                <Link to="/login" className="btn-primary text-sm py-2 px-4">Login</Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
          {[
            { to: '/crafts', label: 'Craft List' },
            { to: '/artists', label: 'Artist List' },
            { to: '/map', label: 'Sri Lanka Map' },
            { to: '/workshops', label: 'Workshop Booking' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}
              className={({ isActive }) => `block py-2 text-sm font-medium ${isActive ? 'text-orange-600' : 'text-gray-700'}`}>
              {label}
            </NavLink>
          ))}
          <div className="border-t border-gray-100 pt-2 mt-2">
            {user ? (
              <>
                <Link to={dashboardPath} onClick={() => setOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm text-gray-700">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 py-2 text-sm text-red-500 w-full">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link to="/register" onClick={() => setOpen(false)} className="btn-secondary text-sm py-2 px-4 flex-1 text-center">Register</Link>
                <Link to="/login" onClick={() => setOpen(false)} className="btn-primary text-sm py-2 px-4 flex-1 text-center">Login</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
