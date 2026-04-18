import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Tag, Package, DollarSign, User, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
import { getErrorMessage } from '../utils/helpers.js';

export default function CraftDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [craft, setCraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    api.get(`/crafts/${id}`).then(({ data }) => setCraft(data)).catch(() => navigate('/crafts'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChat = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'tourist') return toast.error('Only tourists can chat with artists');
    setChatLoading(true);
    try {
      await api.post('/chats', { artistId: craft.artist._id, craftId: craft._id });
      navigate('/tourist/chats');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setChatLoading(false);
  };

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>;
  if (!craft) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/crafts" className="flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-6 text-sm">
        <ArrowLeft size={16} /> Back to Crafts
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden aspect-square bg-gray-100">
            <img
              src={craft.images?.[activeImg] || 'https://via.placeholder.com/600?text=No+Image'}
              alt={craft.title}
              className="w-full h-full object-cover"
            />
          </div>
          {craft.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {craft.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${activeImg === i ? 'border-orange-500' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            {craft.category && (
              <span className="badge bg-orange-100 text-orange-700 mb-2">
                <Tag size={10} className="mr-1" />{craft.category}
              </span>
            )}
            <h1 className="text-3xl font-bold text-gray-900">{craft.title}</h1>
          </div>

          <div className="flex gap-4">
            {craft.price > 0 && (
              <div className="flex items-center gap-2 text-2xl font-bold text-orange-600">
                <DollarSign size={20} />LKR {craft.price.toLocaleString()}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Package size={16} />Qty: {craft.quantity}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{craft.description}</p>
          </div>

          {craft.materials?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Materials Used</h3>
              <div className="flex flex-wrap gap-2">
                {craft.materials.map((m) => (
                  <span key={m} className="badge bg-gray-100 text-gray-600">{m}</span>
                ))}
              </div>
            </div>
          )}

          {/* Artist */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-800 mb-3">About the Artist</h3>
            <div className="flex items-center gap-3">
              <img
                src={craft.artist?.avatar || `https://ui-avatars.com/api/?name=${craft.artist?.name}&background=f97316&color=fff`}
                alt={craft.artist?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <Link to={`/artists/${craft.artist?._id}`} className="font-semibold text-gray-900 hover:text-orange-600">
                  {craft.artist?.name}
                </Link>
                {craft.artist?.craftSpecialization?.length > 0 && (
                  <p className="text-sm text-gray-500">{craft.artist.craftSpecialization.join(', ')}</p>
                )}
              </div>
              <Link to={`/artists/${craft.artist?._id}`} className="ml-auto btn-secondary text-sm py-1.5 px-3 flex items-center gap-1">
                <User size={14} /> Profile
              </Link>
            </div>
          </div>

          <button onClick={handleChat} disabled={chatLoading}
            className="btn-primary w-full flex items-center justify-center gap-2">
            <MessageCircle size={18} />
            {chatLoading ? 'Opening chat...' : user?.role === 'tourist' ? 'Chat with Artist' : 'Login as tourist to chat'}
          </button>
        </div>
      </div>
    </div>
  );
}
