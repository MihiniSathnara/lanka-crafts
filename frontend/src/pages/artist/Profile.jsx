import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Camera, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import { getErrorMessage } from '../../utils/helpers.js';

const SPECIALIZATIONS = ['Batik', 'Handloom', 'Wood Carving', 'Lacquerware', 'Pottery', 'Metalwork', 'Coir Products', 'Mask Making', 'Jewelry', 'Painting'];

export default function ArtistProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name, phone: user.phone, bio: user.bio,
        address: user.address, workshopName: user.workshopName,
        workshopAddress: user.workshopLocation?.address,
        lat: user.workshopLocation?.lat, lng: user.workshopLocation?.lng,
      });
      setSelectedSpecs(user.craftSpecialization || []);
    }
  }, [user]);

  const toggleSpec = (spec) => setSelectedSpecs(prev => prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]);

  const onSave = async (data) => {
    try {
      const payload = {
        name: data.name, phone: data.phone, bio: data.bio,
        address: data.address, workshopName: data.workshopName,
        craftSpecialization: selectedSpecs,
        workshopLocation: {
          address: data.workshopAddress,
          lat: parseFloat(data.lat) || 7.8731,
          lng: parseFloat(data.lng) || 80.7718,
        },
      };
      const { data: updated } = await api.put('/users/profile', payload);
      updateUser(updated);
      toast.success('Profile updated!');
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('avatar', file);
    setUploading(true);
    try {
      const { data } = await api.put('/users/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data.user);
      toast.success('Avatar updated!');
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setUploading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete your account? This cannot be undone.')) return;
    setDeleting(true);
    try { await api.delete('/users/account'); logout(); }
    catch (err) { toast.error(getErrorMessage(err)); }
    finally { setDeleting(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Artist Profile</h1>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=f97316&color=fff&size=80`}
              alt={user?.name} className="w-20 h-20 rounded-full object-cover border-4 border-orange-100" />
            <button onClick={() => fileRef.current.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600">
              <Camera size={12} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="badge bg-orange-100 text-orange-700 mt-1">Artist</span>
            {uploading && <p className="text-xs text-orange-500 mt-1">Uploading...</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input className="input-field" {...register('name', { required: 'Name required' })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input className="input-field" {...register('phone')} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea className="input-field" rows={3} {...register('bio')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Workshop Name</label>
              <input className="input-field" {...register('workshopName')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input className="input-field" {...register('address')} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Workshop Location Address</label>
              <input className="input-field" {...register('workshopAddress')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input type="number" step="any" className="input-field" {...register('lat')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input type="number" step="any" className="input-field" {...register('lng')} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Craft Specializations</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map(s => (
                <button key={s} type="button" onClick={() => toggleSpec(s)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${selectedSpecs.includes(s) ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="card p-6 border-red-100">
        <h3 className="font-semibold text-gray-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all data.</p>
        <button onClick={handleDelete} disabled={deleting} className="btn-danger flex items-center gap-2">
          <Trash2 size={16} /> {deleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
}
