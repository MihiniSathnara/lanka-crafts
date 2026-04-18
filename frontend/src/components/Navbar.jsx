import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Menu, X, LogOut, LayoutDashboard, Palette, Plus, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setOpen(false);
    setDropdownOpen(false);
  };

  const isTourist = user?.role === 'tourist';
  const isArtist = user?.role === 'artist';

  /* ── Tourist navbar ──────────────────────────────────────────────────── */
  if (isTourist) {
    const tLink = ({ isActive }) =>
      `relative pb-0.5 text-sm font-medium transition-colors ${isActive ? 'text-amber-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-600 after:rounded-full' : 'text-gray-600 hover:text-amber-700'}`;

    return (
      <nav className="bg-white border-b border-amber-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5">
              <span className="text-amber-600 font-bold text-lg">+</span>
              <span className="text-lg font-bold text-gray-900">Lanka <span className="text-amber-600">Crafts</span></span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink to="/" end className={tLink}>Home</NavLink>
              <NavLink to="/tourist/dashboard" className={tLink}>Dashboard</NavLink>
              <NavLink to="/blogs" className={tLink}>Blogs</NavLink>
              <NavLink to="/tourist/bookings" className={tLink}>Bookings</NavLink>
              <NavLink to="/tourist/chats" className={tLink}>Inbox</NavLink>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <button className="relative p-2 text-gray-500 hover:text-amber-700 transition-colors">
                <Bell size={18} />
              </button>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors"
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=c2410c&color=fff&size=32`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-100"
                  />
                  <span>{user.name.split(' ')[0]}</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                    <Link to="/tourist/profile" onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                      My Profile
                    </Link>
                    <Link to="/tourist/blogs" onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                      My Blogs
                    </Link>
                    <Link to="/tourist/bookings" onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                      My Bookings
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button className="md:hidden" onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-white border-t border-amber-100 px-4 py-3 space-y-1">
            {[
              { to: '/', label: 'Home', end: true },
              { to: '/tourist/dashboard', label: 'Dashboard' },
              { to: '/blogs', label: 'Blogs' },
              { to: '/tourist/bookings', label: 'Bookings' },
              { to: '/tourist/chats', label: 'Inbox' },
              { to: '/tourist/profile', label: 'My Profile' },
            ].map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
                className={({ isActive }) => `block py-2 px-3 rounded-lg text-sm font-medium ${isActive ? 'bg-amber-50 text-amber-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                {label}
              </NavLink>
            ))}
            <button onClick={handleLogout} className="flex items-center gap-2 py-2 px-3 text-sm text-red-500 w-full rounded-lg hover:bg-red-50">
              <LogOut size={15} /> Logout
            </button>
          </div>
        )}
      </nav>
    );
  }

  /* ── Artist navbar ───────────────────────────────────────────────────── */
  if (isArtist) {
    const aLink = ({ isActive }) =>
      `text-sm font-medium transition-colors ${isActive ? 'text-white font-semibold' : 'text-green-100 hover:text-white'}`;

    return (
      <nav className="bg-[#14532d] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2">
              <Palette className="text-green-300" size={22} />
              <span className="text-lg font-bold text-white">Lanka <span className="text-green-300">Craft</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-5">
              <NavLink to="/artist/dashboard" className={aLink}>Dashboard</NavLink>
              <NavLink to="/artist/crafts" className={aLink}>My Crafts</NavLink>
              <NavLink to="/artist/availability" className={aLink}>Schedule</NavLink>
              <NavLink to="/artist/chats" className={aLink}>Messages</NavLink>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link to="/artist/profile"
                className="flex items-center gap-2 text-sm font-medium text-green-100 hover:text-white transition-colors">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=15803d&color=fff&size=32`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-green-700"
                />
                <span>{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-red-300 hover:text-red-200 font-medium">
                <LogOut size={15} />Logout
              </button>
            </div>
            <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden bg-[#14532d] border-t border-green-800 px-4 py-3 space-y-1">
            {[
              { to: '/artist/dashboard', label: 'Dashboard' },
              { to: '/artist/crafts', label: 'My Crafts' },
              { to: '/artist/availability', label: 'Schedule' },
              { to: '/artist/chats', label: 'Messages' },
              { to: '/artist/profile', label: 'Profile' },
            ].map(({ to, label }) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)}
                className={({ isActive }) => `block py-2 px-3 rounded-lg text-sm font-medium ${isActive ? 'bg-green-800 text-white' : 'text-green-100 hover:bg-green-800'}`}>
                {label}
              </NavLink>
            ))}
            <button onClick={handleLogout} className="flex items-center gap-2 py-2 px-3 text-sm text-red-300 w-full rounded-lg hover:bg-green-800">
              <LogOut size={15} /> Logout
            </button>
          </div>
        )}
      </nav>
    );
  }

  /* ── Public / Admin navbar ───────────────────────────────────────────── */
  const pLink = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600'}`;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Palette className="text-amber-600" size={26} />
            <span className="text-xl font-bold text-gray-900">Lanka<span className="text-amber-600">Crafts</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={pLink}>Home</NavLink>
            <NavLink to="/crafts" className={pLink}>Crafts</NavLink>
            <NavLink to="/artists" className={pLink}>Artists</NavLink>
            <NavLink to="/workshops" className={pLink}>Book a Workshop</NavLink>
            <NavLink to="/blogs" className={pLink}>Blogs</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/'}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-amber-600">
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
                <Link to="/login" className="text-sm font-semibold text-gray-700 border border-gray-300 hover:border-amber-400 px-4 py-2 rounded-full transition-colors">Login</Link>
                <Link to="/register" className="text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full transition-colors">Register</Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {[
            { to: '/', label: 'Home', end: true },
            { to: '/crafts', label: 'Crafts' },
            { to: '/artists', label: 'Artists' },
            { to: '/workshops', label: 'Book a Workshop' },
            { to: '/blogs', label: 'Blogs' },
          ].map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
              className={({ isActive }) => `block py-2 px-3 rounded-lg text-sm font-medium ${isActive ? 'bg-amber-50 text-amber-700' : 'text-gray-700 hover:bg-gray-50'}`}>
              {label}
            </NavLink>
          ))}
          <div className="border-t border-gray-100 pt-2 mt-2">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/'} onClick={() => setOpen(false)}
                  className="flex items-center gap-2 py-2 px-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 py-2 px-3 text-sm text-red-500 w-full rounded-lg hover:bg-red-50">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-full text-sm font-semibold text-gray-700">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center py-2 px-4 bg-amber-600 text-white rounded-full text-sm font-semibold">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
