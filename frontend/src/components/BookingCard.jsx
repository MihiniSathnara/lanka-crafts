import { Calendar, QrCode } from 'lucide-react';
import { format } from '../utils/helpers.js';

const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function BookingCard({ booking, onShowQR }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{booking.artist?.workshopName || booking.artist?.name}</p>
          {booking.workshopSlot && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Calendar size={13} className="text-orange-500" />
              {format(booking.workshopSlot.date)} · {booking.workshopSlot.startTime} – {booking.workshopSlot.endTime}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}>
            {booking.status}
          </span>
          {onShowQR && (
            <button onClick={() => onShowQR(booking)}
              className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-gray-500">
              <QrCode size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
