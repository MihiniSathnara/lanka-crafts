import { QRCodeSVG } from 'qrcode.react';
import { X, Download } from 'lucide-react';

export default function QRModal({ booking, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900">Booking QR Code</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white border-2 border-orange-200 rounded-xl">
            <QRCodeSVG value={booking.qrData || booking._id} size={200} />
          </div>
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p className="font-semibold text-gray-800">
              {booking.artist?.workshopName || 'Workshop'}
            </p>
            <p>{booking.workshopSlot?.date ? new Date(booking.workshopSlot.date).toLocaleDateString() : ''}</p>
            <p>{booking.workshopSlot?.startTime} - {booking.workshopSlot?.endTime}</p>
            <span className={`badge ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {booking.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
