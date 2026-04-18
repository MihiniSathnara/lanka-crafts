import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, X, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import Spinner from '../../components/Spinner.jsx';
import { getErrorMessage } from '../../utils/helpers.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function CraftManagement() {
  const { user } = useAuth();
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [files, setFiles] = useState([]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const load = () => {
    api.get(`/crafts/artist/${user._id}`).then(({ data }) => setCrafts(data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openForm = (craft = null) => {
    setEditing(craft);
    setFiles([]);
    if (craft) {
      reset({ title: craft.title, description: craft.description, materials: craft.materials?.join(', '), price: craft.price, quantity: craft.quantity, category: craft.category, isAvailable: craft.isAvailable });
    } else {
      reset({ price: 0, quantity: 1, isAvailable: true });
    }
    setShowForm(true);
  };

  const onSubmit = async (data) => {
    try {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => form.append(k, v));
      files.forEach(f => form.append('images', f));

      if (editing) {
        const { data: updated } = await api.put(`/crafts/${editing._id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
        setCrafts(prev => prev.map(c => c._id === editing._id ? updated : c));
        toast.success('Craft updated!');
      } else {
        const { data: created } = await api.post('/crafts', form, { headers: { 'Content-Type': 'multipart/form-data' } });
        setCrafts(prev => [created, ...prev]);
        toast.success('Craft added!');
      }
      setShowForm(false);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const deleteCraft = async (id) => {
    if (!confirm('Delete this craft?')) return;
    try {
      await api.delete(`/crafts/${id}`);
      setCrafts(prev => prev.filter(c => c._id !== id));
      toast.success('Craft deleted');
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Craft Management</h1>
        <button onClick={() => openForm()} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Craft
        </button>
      </div>

      {loading ? <Spinner size="lg" /> : crafts.length === 0 ? (
        <div className="card p-12 text-center">
          <Image size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No crafts yet</p>
          <button onClick={() => openForm()} className="btn-primary text-sm mt-4">Add Your First Craft</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {crafts.map(craft => (
            <div key={craft._id} className="card group">
              <div className="relative h-44 overflow-hidden">
                <img src={craft.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={craft.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openForm(craft)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-orange-600">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteCraft(craft._id)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
                {!craft.isAvailable && (
                  <span className="absolute top-2 right-2 badge bg-red-100 text-red-700">Unavailable</span>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 truncate">{craft.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{craft.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-semibold text-orange-600">
                    {craft.price > 0 ? `LKR ${craft.price.toLocaleString()}` : 'Price on request'}
                  </span>
                  <span className="text-xs text-gray-400">Qty: {craft.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editing ? 'Edit Craft' : 'Add New Craft'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input className="input-field" {...register('title', { required: 'Title required' })} />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea className="input-field" rows={3} {...register('description', { required: 'Description required' })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR)</label>
                  <input type="number" className="input-field" {...register('price')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" className="input-field" {...register('quantity')} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input className="input-field" placeholder="e.g. Batik, Pottery" {...register('category')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Materials (comma separated)</label>
                <input className="input-field" placeholder="Cotton, Natural dyes" {...register('materials')} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="avail" {...register('isAvailable')} className="rounded text-orange-500" />
                <label htmlFor="avail" className="text-sm text-gray-700">Available for purchase</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images {editing ? '(adds to existing)' : ''}</label>
                <input type="file" multiple accept="image/*" onChange={e => setFiles(Array.from(e.target.files))}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                {files.length > 0 && <p className="text-xs text-gray-400 mt-1">{files.length} file(s) selected</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                  {isSubmitting ? 'Saving...' : editing ? 'Update Craft' : 'Add Craft'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
