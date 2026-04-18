import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import api from '../api/axios.js';
import Spinner from '../components/Spinner.jsx';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function SriLankaMap() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/map/artists').then(({ data }) => setLocations(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title">Artist Workshop Locations</h1>
        <p className="text-gray-500">Find artists and workshops near you across Sri Lanka</p>
      </div>

      {loading ? (
        <div className="py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-[500px]">
              <MapContainer center={[7.8731, 80.7718]} zoom={7} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map(loc => (
                  <Marker key={loc._id} position={[loc.lat, loc.lng]} icon={customIcon}>
                    <Popup>
                      <div className="min-w-[180px]">
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={loc.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(loc.name)}&background=f97316&color=fff`}
                            alt={loc.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{loc.name}</p>
                            {loc.workshopName && <p className="text-orange-600 text-xs">{loc.workshopName}</p>}
                          </div>
                        </div>
                        {loc.address && <p className="text-xs text-gray-500 mb-1">{loc.address}</p>}
                        {loc.craftSpecialization?.length > 0 && (
                          <p className="text-xs text-gray-500 mb-2">{loc.craftSpecialization.join(', ')}</p>
                        )}
                        <a href={`/artists/${loc._id}`}
                          className="text-xs font-semibold text-orange-600 hover:underline">
                          View Profile →
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 mb-2">{locations.length} Artists on Map</h3>
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {locations.map(loc => (
                <Link key={loc._id} to={`/artists/${loc._id}`}
                  className="card p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
                  <img
                    src={loc.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(loc.name)}&background=f97316&color=fff`}
                    alt={loc.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{loc.name}</p>
                    <p className="text-xs text-orange-600 truncate">{loc.workshopName}</p>
                    <p className="text-xs text-gray-400 truncate">{loc.address}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
