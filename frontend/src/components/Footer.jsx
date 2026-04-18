import { Link } from 'react-router-dom';
import { Palette, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="text-orange-400" size={24} />
            <span className="text-white font-bold text-lg">Lanka<span className="text-orange-400">Crafts</span></span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Connecting tourists with Sri Lanka's talented artisans. Discover authentic crafts, book workshops, and support local artists.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/crafts" className="hover:text-orange-400 transition-colors">Craft List</Link></li>
            <li><Link to="/artists" className="hover:text-orange-400 transition-colors">Artist List</Link></li>
            <li><Link to="/map" className="hover:text-orange-400 transition-colors">Sri Lanka Map</Link></li>
            <li><Link to="/workshops" className="hover:text-orange-400 transition-colors">Book a Workshop</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/register" className="hover:text-orange-400 transition-colors">Register as Tourist</Link></li>
            <li><Link to="/register" className="hover:text-orange-400 transition-colors">Register as Artist</Link></li>
            <li><Link to="/login" className="hover:text-orange-400 transition-colors">Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail size={14} className="text-orange-400" /> info@lankacrafts.lk</li>
            <li className="flex items-center gap-2"><Phone size={14} className="text-orange-400" /> +94 11 234 5678</li>
            <li className="flex items-center gap-2"><MapPin size={14} className="text-orange-400" /> Colombo, Sri Lanka</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} LankaCrafts. All rights reserved.
      </div>
    </footer>
  );
}
