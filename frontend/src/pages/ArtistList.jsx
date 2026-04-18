import { useEffect, useState } from 'react';
import ArtistCard from '../components/ArtistCard.jsx';
import Spinner from '../components/Spinner.jsx';
import api from '../api/axios.js';
import { Search } from 'lucide-react';

export default function ArtistList() {
  const [artists, setArtists] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [spec, setSpec] = useState('');

  useEffect(() => {
    api.get('/users/artists').then(({ data }) => { setArtists(data); setFiltered(data); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = artists;
    if (search) result = result.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.workshopName?.toLowerCase().includes(search.toLowerCase()));
    if (spec) result = result.filter(a => a.craftSpecialization?.includes(spec));
    setFiltered(result);
  }, [search, spec, artists]);

  const allSpecs = [...new Set(artists.flatMap(a => a.craftSpecialization || []))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title">Sri Lankan Artists</h1>
        <p className="text-gray-500">Meet the talented artisans preserving Sri Lanka's craft heritage</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search artists..." className="input-field pl-10" />
        </div>
        {allSpecs.length > 0 && (
          <select value={spec} onChange={e => setSpec(e.target.value)} className="input-field min-w-48">
            <option value="">All Specializations</option>
            {allSpecs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>

      {loading ? (
        <div className="py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No artists found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(artist => <ArtistCard key={artist._id} artist={artist} />)}
        </div>
      )}
    </div>
  );
}
