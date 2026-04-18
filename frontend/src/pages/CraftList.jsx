import { useEffect, useState } from 'react';
import CraftCard from '../components/CraftCard.jsx';
import Spinner from '../components/Spinner.jsx';
import api from '../api/axios.js';
import { Search, Filter } from 'lucide-react';

export default function CraftList() {
  const [crafts, setCrafts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    api.get('/crafts').then(({ data }) => { setCrafts(data); setFiltered(data); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = crafts;
    if (search) result = result.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()));
    if (category) result = result.filter(c => c.category === category);
    setFiltered(result);
  }, [search, category, crafts]);

  const categories = [...new Set(crafts.map(c => c.category).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title">Sri Lankan Crafts</h1>
        <p className="text-gray-500">Discover authentic handmade crafts from talented local artists</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search crafts..."
            className="input-field pl-10" />
        </div>
        {categories.length > 0 && (
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="input-field pl-9 pr-8 min-w-40">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No crafts found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(craft => <CraftCard key={craft._id} craft={craft} />)}
        </div>
      )}
    </div>
  );
}
