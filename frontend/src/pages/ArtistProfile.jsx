import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, MessageCircle, Star, Palette, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
import CraftCard from '../components/CraftCard.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import StarRating from '../components/StarRating.jsx';
import { format, getErrorMessage } from '../utils/helpers.js';

export default function ArtistProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [crafts, setCrafts] = useState([]);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [aRes, cRes, sRes, rRes] = await Promise.all([
          api.get(`/users/artists/${id}`),
          api.get(`/crafts/artist/${id}`),
          api.get(`/workshops/artist/${id}/available`),
          api.get(`/reviews/artist/${id}`),
        ]);
        setArtist(aRes.data);
        setCrafts(cRes.data);
        setSlots(sRes.data);
        setReviews(rRes.data.reviews);
        setAvgRating(rRes.data.avgRating);
      } catch { navigate('/artists'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleBook = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'tourist') return toast.error('Only tourists can book workshops');
    if (!bookingSlot) return toast.error('Please select a time slot');
    setBookingLoading(true);
    try {
      await api.post('/bookings', { artistId: id, workshopSlotId: bookingSlot });
      toast.success('Workshop booked successfully! Check your dashboard for the QR code.');
      setSlots(prev => prev.filter(s => s._id !== bookingSlot));
      setBookingSlot('');
      navigate('/tourist/bookings');
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setBookingLoading(false); }
  };

  const handleChat = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'tourist') return toast.error('Only tourists can chat');
    setChatLoading(true);
    try {
      await api.post('/chats', { artistId: id });
      navigate('/tourist/chats');
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setChatLoading(false); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (user.role !== 'tourist') return toast.error('Only tourists can leave reviews');
    setReviewLoading(true);
    try {
      const { data } = await api.post('/reviews', { artistId: id, ...reviewForm });
      setReviews(prev => [data, ...prev]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setReviewLoading(false); }
  };

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>;
  if (!artist) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/artists" className="flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-6 text-sm">
        <ArrowLeft size={16} /> Back to Artists
      </Link>

      {/* Profile Header */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <img
            src={artist.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=f97316&color=fff&size=120`}
            alt={artist.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-orange-100"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{artist.name}</h1>
            {artist.workshopName && <p className="text-orange-600 font-semibold text-lg">{artist.workshopName}</p>}
            {artist.workshopLocation?.address && (
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <MapPin size={14} />{artist.workshopLocation.address}
              </div>
            )}
            {avgRating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={Math.round(avgRating)} readOnly size={16} />
                <span className="text-sm text-gray-500">{avgRating} ({reviews.length} reviews)</span>
              </div>
            )}
            {artist.craftSpecialization?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {artist.craftSpecialization.map(s => (
                  <span key={s} className="badge bg-amber-50 text-amber-700 border border-amber-200">
                    <Palette size={10} className="mr-1" />{s}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={handleChat} disabled={chatLoading}
              className="btn-secondary flex items-center gap-2 text-sm">
              <MessageCircle size={16} /> Chat
            </button>
          </div>
        </div>
        {artist.bio && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-gray-600 leading-relaxed">{artist.bio}</p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Crafts */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Crafts by {artist.name}</h2>
            {crafts.length === 0 ? (
              <p className="text-gray-400 text-sm">No crafts listed yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {crafts.map(c => <CraftCard key={c._id} craft={c} />)}
              </div>
            )}
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
            {user?.role === 'tourist' && (
              <form onSubmit={handleReview} className="card p-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Leave a Review</h3>
                <StarRating rating={reviewForm.rating} onChange={r => setReviewForm(p => ({ ...p, rating: r }))} />
                <textarea value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                  required placeholder="Share your experience..." rows={3}
                  className="input-field mt-3" />
                <button type="submit" disabled={reviewLoading} className="btn-primary text-sm mt-3">
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-3">
                {reviews.map(r => <ReviewCard key={r._id} review={r} />)}
              </div>
            )}
          </section>
        </div>

        {/* Workshop Booking Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-orange-500" /> Book a Workshop
            </h2>
            {slots.length === 0 ? (
              <p className="text-sm text-gray-400">No available slots at the moment.</p>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {slots.map(slot => (
                    <label key={slot._id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${bookingSlot === slot._id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
                      <input type="radio" name="slot" value={slot._id}
                        checked={bookingSlot === slot._id}
                        onChange={() => setBookingSlot(slot._id)}
                        className="text-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{format(slot.date)}</p>
                        <p className="text-xs text-gray-500">{slot.startTime} – {slot.endTime}</p>
                        {slot.description && <p className="text-xs text-gray-400 mt-0.5">{slot.description}</p>}
                      </div>
                    </label>
                  ))}
                </div>
                <button onClick={handleBook} disabled={bookingLoading || !bookingSlot}
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  <Calendar size={16} />
                  {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
                {!user && <p className="text-xs text-gray-400 text-center">You must be logged in as a tourist to book.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
