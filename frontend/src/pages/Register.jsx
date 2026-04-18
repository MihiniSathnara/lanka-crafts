import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { getErrorMessage } from '../utils/helpers.js';

const SPECIALIZATIONS = ['Batik', 'Handloom', 'Wood Carving', 'Lacquerware', 'Pottery', 'Metalwork', 'Coir Products', 'Mask Making', 'Jewelry', 'Painting'];

export default function Register() {
  const [role, setRole] = useState('tourist');
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const navigate = useNavigate();

  const toggleSpec = (spec) => {
    setSelectedSpecs((prev) => prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]);
  };

  const onSubmit = async (data) => {
    if (role === 'artist' && selectedSpecs.length === 0) {
      return toast.error('Please select at least one craft specialization');
    }
    try {
      const payload = {
        ...data,
        role,
        craftSpecialization: selectedSpecs,
        workshopLocation: role === 'artist' ? {
          address: data.workshopAddress,
          lat: parseFloat(data.lat) || 7.8731,
          lng: parseFloat(data.lng) || 80.7718,
        } : undefined,
      };
      await api.post('/auth/register', payload);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Palette className="text-orange-500" size={28} />
          <span className="text-2xl font-bold text-gray-900">Lanka<span className="text-orange-500">Crafts</span></span>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">Create an account</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Join the LankaCrafts community</p>

        {/* Role selector */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-6">
          {['tourist', 'artist'].map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-colors ${
                role === r ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}>
              {r === 'tourist' ? '🧳 Tourist' : '🎨 Artist'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input className="input-field" placeholder="John Silva"
                {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" className="input-field" placeholder="your@email.com"
                {...register('email', { required: 'Email required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input type="password" className="input-field" placeholder="Min 6 characters"
                {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input className="input-field" placeholder="+94 77 123 4567"
                {...register('phone')} />
            </div>
          </div>

          {role === 'tourist' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                <input className="input-field" placeholder="United Kingdom"
                  {...register('country', { required: 'Country required for tourist' })} />
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIC / Passport Number *</label>
                <input className="input-field" placeholder="A12345678"
                  {...register('nic_passport', { required: 'ID required for tourist' })} />
                {errors.nic_passport && <p className="text-red-500 text-xs mt-1">{errors.nic_passport.message}</p>}
              </div>
            </div>
          )}

          {role === 'artist' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea className="input-field" rows={2} placeholder="Tell tourists about yourself..."
                  {...register('bio')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Craft Specializations *</label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALIZATIONS.map((s) => (
                    <button key={s} type="button" onClick={() => toggleSpec(s)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        selectedSpecs.includes(s) ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Workshop Name</label>
                  <input className="input-field" placeholder="Silva Batik Studio"
                    {...register('workshopName')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input className="input-field" placeholder="123 Main St, Kandy"
                    {...register('address')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Workshop Location Address</label>
                  <input className="input-field" placeholder="Kandy, Sri Lanka"
                    {...register('workshopAddress')} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude <span className="text-gray-400 text-xs">(use Google Maps)</span></label>
                  <input type="number" step="any" className="input-field" placeholder="7.2906"
                    {...register('lat')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input type="number" step="any" className="input-field" placeholder="80.6337"
                    {...register('lng')} />
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
