import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, QrCode, MessageCircle } from 'lucide-react';
import api from '../../api/axios.js';
import Spinner from '../../components/Spinner.jsx';
import QRModal from '../../components/QRModal.jsx';
import { format } from '../../utils/helpers.js';

const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function TouristBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrBooking, setQrBooking] = useState(null);

  useEffect(() => {
    api.get('/bookings/my').then(({ data }) => setBookings(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Workshop Bookings</h1>

      {bookings.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No bookings yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Book a workshop to get started!</p>
          <Link to="/workshops" className="btn-primary text-sm">Browse Workshops</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking._id} className="card p-5">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <img
                  src={booking.artist?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.artist?.name || 'A')}&background=f97316&color=fff`}
                  alt={booking.artist?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <Link to={`/artists/${booking.artist?._id}`}
                        className="font-bold text-gray-900 hover:text-orange-600">
                        {booking.artist?.workshopName || booking.artist?.name}
                      </Link>
                      <p className="text-sm text-gray-500">{booking.artist?.name}</p>
                    </div>
                    <span className={`badge ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                      {booking.status}
                    </span>
                  </div>
                  {booking.workshopSlot && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Calendar size={14} className="text-orange-500" />
                      {format(booking.workshopSlot.date)} · {booking.workshopSlot.startTime} – {booking.workshopSlot.endTime}
                    </div>
                  )}
                  {booking.artist?.workshopLocation?.address && (
                    <p className="text-xs text-gray-400 mt-1">{booking.artist.workshopLocation.address}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Booked on {format(booking.createdAt)}</p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setQrBooking(booking)}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                    <QrCode size={14} /> QR Code
                  </button>
                  <Link to="/tourist/chats"
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                    <MessageCircle size={14} /> Chat
                  </Link>
                </div>
              </div>
              {booking.notes && (
                <p className="text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100">
                  Notes: {booking.notes}
                </p>
              )}
              {booking.status === 'confirmed' && (
                <p className="text-xs text-amber-600 mt-2">
                  💬 To cancel this booking, please chat with the artist.
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {qrBooking && <QRModal booking={qrBooking} onClose={() => setQrBooking(null)} />}
    </div>
  );
}
