import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';

export default function CraftCard({ craft }) {
  const image = craft.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';
  return (
    <Link to={`/crafts/${craft._id}`} className="card group hover:shadow-md transition-shadow duration-200">
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={craft.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {craft.category && (
          <span className="absolute top-2 left-2 badge bg-orange-100 text-orange-700">
            <Tag size={10} className="mr-1" />{craft.category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">{craft.title}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{craft.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <img
              src={craft.artist?.avatar || `https://ui-avatars.com/api/?name=${craft.artist?.name}&background=f97316&color=fff`}
              alt={craft.artist?.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-gray-500">{craft.artist?.name}</span>
          </div>
          {craft.price > 0 && (
            <span className="text-sm font-semibold text-orange-600">LKR {craft.price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
