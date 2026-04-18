import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/helpers.js';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    const path = user.role === 'tourist' ? '/tourist/dashboard'
      : user.role === 'artist' ? '/artist/dashboard' : '/admin/dashboard';
    navigate(path, { replace: true });
    return null;
  }

  const onSubmit = async (data) => {
    try {
      const { data: res } = await api.post('/auth/login', data);
      login(res.token, res.user);
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
      const path = res.user.role === 'tourist' ? '/tourist/dashboard'
        : res.user.role === 'artist' ? '/artist/dashboard' : '/admin/dashboard';
      navigate(path);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Palette className="text-orange-500" size={28} />
          <span className="text-2xl font-bold text-gray-900">Lanka<span className="text-orange-500">Crafts</span></span>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">Welcome back</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="your@email.com"
              {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-600 font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
