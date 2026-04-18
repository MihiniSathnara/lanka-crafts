import StarRating from './StarRating.jsx';
import { format } from '../utils/helpers.js';

export default function ReviewCard({ review }) {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <img
          src={review.tourist?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.tourist?.name || 'U')}&background=f97316&color=fff`}
          alt={review.tourist?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-gray-900">{review.tourist?.name}</p>
              {review.tourist?.country && (
                <p className="text-xs text-gray-400">{review.tourist.country}</p>
              )}
            </div>
            <span className="text-xs text-gray-400">{format(review.createdAt)}</span>
          </div>
          <StarRating rating={review.rating} readOnly size={14} />
          <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}
