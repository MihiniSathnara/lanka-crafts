import { Link } from 'react-router-dom';
import { MapPin, Palette } from 'lucide-react';

export default function ArtistCard({ artist }) {
  return (
    <Link to={`/artists/${artist._id}`} className="card group hover:shadow-md transition-shadow duration-200 p-5">
      <div className="flex items-center gap-4">
        <img
          src={artist.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=f97316&color=fff&size=80`}
          alt={artist.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">{artist.name}</h3>
          {artist.workshopName && (
            <p className="text-sm text-orange-600 font-medium truncate">{artist.workshopName}</p>
          )}
          {artist.workshopLocation?.address && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
              <MapPin size={11} /><span className="truncate">{artist.workshopLocation.address}</span>
            </div>
          )}
        </div>
      </div>
      {artist.craftSpecialization?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {artist.craftSpecialization.slice(0, 3).map((s) => (
            <span key={s} className="badge bg-amber-50 text-amber-700 border border-amber-200">
              <Palette size={9} className="mr-1" />{s}
            </span>
          ))}
        </div>
      )}
      {artist.bio && (
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{artist.bio}</p>
      )}
    </Link>
  );
}
