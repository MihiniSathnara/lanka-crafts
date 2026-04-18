import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Camera, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import { getErrorMessage } from '../../utils/helpers.js';

export default function TouristProfile() {
  const { user, updateUser, logout } = useAuth();
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (user) reset({ name: user.name, phone: user.phone, country: user.country, nic_passport: user.nic_passport });
  }, [user]);

  const onSave = async (data) => {
    try {
      const { data: updated } = await api.put('/users/profile', data);
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
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete('/users/account');
      toast.success('Account deleted');
      logout();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setDeleting(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=f97316&color=fff&size=80`}
              alt={user?.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-orange-100"
            />
            <button onClick={() => fileRef.current.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600">
              <Camera size={12} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="badge bg-blue-100 text-blue-700 mt-1">Tourist</span>
            {uploading && <p className="text-xs text-orange-500 mt-1">Uploading...</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input className="input-field" {...register('name', { required: 'Name required' })} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input className="input-field" {...register('phone')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input className="input-field" {...register('country')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIC / Passport</label>
              <input className="input-field" {...register('nic_passport')} />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="card p-6 border-red-100">
        <h3 className="font-semibold text-gray-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all data. This cannot be undone.</p>
        <button onClick={handleDelete} disabled={deleting} className="btn-danger flex items-center gap-2">
          <Trash2 size={16} /> {deleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
}
