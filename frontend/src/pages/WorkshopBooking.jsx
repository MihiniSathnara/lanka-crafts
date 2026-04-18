import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Filter, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
import { format, getErrorMessage } from '../utils/helpers.js';

export default function WorkshopBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    api.get('/users/artists').then(({ data }) => { setArtists(data); setFilteredArtists(data); });
  }, []);

  useEffect(() => {
    if (selectedSpec) {
      setFilteredArtists(artists.filter(a => a.craftSpecialization?.includes(selectedSpec)));
      setSelectedArtist('');
      setSlots([]);
    } else {
      setFilteredArtists(artists);
    }
  }, [selectedSpec, artists]);

  useEffect(() => {
    if (selectedArtist) {
      setSlotsLoading(true);
      api.get(`/workshops/artist/${selectedArtist}/available`)
        .then(({ data }) => setSlots(data))
        .finally(() => setSlotsLoading(false));
    } else {
      setSlots([]);
    }
    setSelectedSlot('');
  }, [selectedArtist]);

  const handleBook = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'tourist') return toast.error('Only tourists can book workshops');
    if (!selectedArtist || !selectedSlot) return toast.error('Please select an artist and time slot');
    setBooking(true);
    try {
      await api.post('/bookings', { artistId: selectedArtist, workshopSlotId: selectedSlot });
      toast.success('Workshop booked successfully!');
      navigate('/tourist/bookings');
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setBooking(false); }
  };

  const allSpecs = [...new Set(artists.flatMap(a => a.craftSpecialization || []))];
  const selectedArtistData = artists.find(a => a._id === selectedArtist);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title">Book a Workshop</h1>
        <p className="text-gray-500">Select a craft specialization, choose an artist, and pick your preferred time slot</p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Specialization */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">1</div>
            <h2 className="font-bold text-gray-900">Select Craft Specialization</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedSpec('')}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${!selectedSpec ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
              All
            </button>
            {allSpecs.map(s => (
              <button key={s} onClick={() => setSelectedSpec(s)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${selectedSpec === s ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Artist */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold ${selectedSpec !== undefined ? 'bg-orange-500' : 'bg-gray-300'}`}>2</div>
            <h2 className="font-bold text-gray-900">Select Artist</h2>
          </div>
          {filteredArtists.length === 0 ? (
            <p className="text-gray-400 text-sm">No artists found for this specialization.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {filteredArtists.map(artist => (
                <button key={artist._id} onClick={() => setSelectedArtist(artist._id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${selectedArtist === artist._id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
                  <img src={artist.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=f97316&color=fff`}
                    alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{artist.name}</p>
                    <p className="text-xs text-orange-600 truncate">{artist.workshopName}</p>
                    <p className="text-xs text-gray-400 truncate">{artist.craftSpecialization?.slice(0,2).join(', ')}</p>
                  </div>
                  {selectedArtist === artist._id && <CheckCircle size={18} className="text-orange-500 flex-shrink-0 ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 3: Slot */}
        {selectedArtist && (
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">3</div>
              <h2 className="font-bold text-gray-900">Select Time Slot</h2>
            </div>
            {slotsLoading ? <Spinner /> : slots.length === 0 ? (
              <p className="text-gray-400 text-sm">No available slots for this artist.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {slots.map(slot => (
                  <label key={slot._id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedSlot === slot._id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
                    <input type="radio" name="slot" value={slot._id} checked={selectedSlot === slot._id}
                      onChange={() => setSelectedSlot(slot._id)} className="text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{format(slot.date)}</p>
                      <p className="text-xs text-gray-500">{slot.startTime} – {slot.endTime}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Book Button */}
        {selectedArtist && selectedSlot && (
          <div className="card p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Booking Summary</h3>
            {selectedArtistData && (
              <div className="flex items-center gap-3 mb-4">
                <img src={selectedArtistData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedArtistData.name)}&background=f97316&color=fff`}
                  alt={selectedArtistData.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium text-gray-900">{selectedArtistData.name}</p>
                  <p className="text-sm text-gray-500">{slots.find(s => s._id === selectedSlot) ? `${format(slots.find(s => s._id === selectedSlot).date)} · ${slots.find(s => s._id === selectedSlot).startTime} – ${slots.find(s => s._id === selectedSlot).endTime}` : ''}</p>
                </div>
              </div>
            )}
            {!user ? (
              <p className="text-sm text-gray-500 mb-3">
                Please <a href="/login" className="text-orange-600 font-semibold">log in as a tourist</a> to book.
              </p>
            ) : (
              <button onClick={handleBook} disabled={booking}
                className="btn-primary w-full flex items-center justify-center gap-2">
                <Calendar size={18} />
                {booking ? 'Booking...' : 'Confirm Booking & Get QR Code'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
