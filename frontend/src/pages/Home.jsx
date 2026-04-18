import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, MessageCircle, Star, ArrowRight, Palette, Users, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-orange-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
              🇱🇰 Discover Sri Lankan Artistry
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Connect with Sri Lanka's
              <span className="text-orange-500"> Master Artisans</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Explore authentic handmade crafts, attend immersive workshops, and build direct relationships with talented local artists across Sri Lanka.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/crafts" className="btn-primary flex items-center gap-2">
                <Search size={18} /> Explore Crafts
              </Link>
              <Link to="/workshops" className="btn-secondary flex items-center gap-2">
                <Calendar size={18} /> Book Workshop
              </Link>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            {[
              { label: 'Artisans', value: '50+' },
              { label: 'Craft Types', value: '20+' },
              { label: 'Happy Tourists', value: '500+' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                <div className="text-2xl font-bold text-orange-600">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="section-title">How LankaCrafts Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Whether you're a curious traveller or a passionate artisan, we make the connection seamless.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Tourist perspective */}
            <div className="bg-orange-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">For Tourists</h3>
              </div>
              <div className="space-y-4">
                {[
                  { icon: <Search size={16} />, step: '1', title: 'Discover', desc: 'Browse hundreds of unique Sri Lankan crafts and meet the talented artists behind them.' },
                  { icon: <MessageCircle size={16} />, step: '2', title: 'Connect', desc: 'Chat directly with artists to ask about crafts, customization, and pricing.' },
                  { icon: <Calendar size={16} />, step: '3', title: 'Book', desc: 'Reserve a hands-on workshop slot and get a QR code confirmation instantly.' },
                  { icon: <Star size={16} />, step: '4', title: 'Review', desc: 'Share your experience and help other travellers discover amazing artisans.' },
                ].map(({ icon, step, title, desc }) => (
                  <div key={step} className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{step}</div>
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-gray-800">{icon}{title}</div>
                      <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Artist perspective */}
            <div className="bg-amber-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
                  <Palette size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">For Artists</h3>
              </div>
              <div className="space-y-4">
                {[
                  { icon: <BookOpen size={16} />, step: '1', title: 'Register', desc: 'Create your artist profile with your specialization, workshop location, and bio.' },
                  { icon: <Palette size={16} />, step: '2', title: 'Showcase', desc: 'Upload your craft items with photos, descriptions, materials, and pricing.' },
                  { icon: <Calendar size={16} />, step: '3', title: 'Manage', desc: 'Set your workshop availability, block dates, and manage incoming bookings.' },
                  { icon: <MessageCircle size={16} />, step: '4', title: 'Engage', desc: 'Reply to tourist inquiries, build relationships, and grow your audience.' },
                ].map(({ icon, step, title, desc }) => (
                  <div key={step} className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{step}</div>
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-gray-800">{icon}{title}</div>
                      <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-title">Why Choose LankaCrafts?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <MapPin className="text-orange-500" size={28} />, title: 'Find Nearby Artists', desc: 'Interactive map showing all workshop locations across Sri Lanka.' },
              { icon: <MessageCircle className="text-blue-500" size={28} />, title: 'Real-Time Chat', desc: 'Message artists directly to discuss crafts and workshop details.' },
              { icon: <Calendar className="text-green-500" size={28} />, title: 'Easy Booking', desc: 'Simple slot selection with instant QR code confirmation.' },
              { icon: <Star className="text-yellow-500" size={28} />, title: 'Verified Reviews', desc: 'Read authentic reviews from tourists who attended workshops.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-3">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-orange-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore Sri Lankan Crafts?</h2>
          <p className="text-orange-100 mb-8">Join thousands of tourists and artists on LankaCrafts.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors">
              Get Started Free
            </Link>
            <Link to="/crafts" className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
              Browse Crafts <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
