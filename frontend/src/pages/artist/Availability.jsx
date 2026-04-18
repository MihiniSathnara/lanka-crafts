import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext.jsx';
import { Plus, Trash2, Lock, Unlock, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import Spinner from '../../components/Spinner.jsx';
import { format, getErrorMessage } from '../../utils/helpers.js';

export default function Availability() {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    api.get(`/workshops/artist/${user._id}`).then(({ data }) => setSlots(data)).finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data) => {
    try {
      const { data: slot } = await api.post('/workshops', data);
      setSlots(prev => [slot, ...prev]);
      toast.success('Slot added!');
      setShowForm(false);
      reset();
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const toggleBlock = async (slot) => {
    try {
      const { data: updated } = await api.put(`/workshops/${slot._id}`, { isBlocked: !slot.isBlocked });
      setSlots(prev => prev.map(s => s._id === slot._id ? updated : s));
      toast.success(updated.isBlocked ? 'Slot blocked' : 'Slot unblocked');
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const deleteSlot = async (id) => {
    if (!confirm('Delete this slot?')) return;
    try {
      await api.delete(`/workshops/${id}`);
      setSlots(prev => prev.filter(s => s._id !== id));
      toast.success('Slot deleted');
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const getStatus = (slot) => {
    if (slot.isBooked) return { label: 'Booked', color: 'bg-green-100 text-green-700' };
    if (slot.isBlocked) return { label: 'Blocked', color: 'bg-red-100 text-red-700' };
    return { label: 'Available', color: 'bg-blue-100 text-blue-700' };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Workshop Availability</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Slot
        </button>
      </div>

      {loading ? <Spinner size="lg" /> : slots.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No workshop slots yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm mt-4">Add First Slot</button>
        </div>
      ) : (
        <div className="space-y-3">
          {slots.sort((a, b) => new Date(a.date) - new Date(b.date)).map(slot => {
            const { label, color } = getStatus(slot);
            return (
              <div key={slot._id} className="card p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-gray-900">{format(slot.date)}</span>
                    <span className="text-gray-500 text-sm">{slot.startTime} – {slot.endTime}</span>
                    <span className={`badge ${color}`}>{label}</span>
                    {slot.isBooked && slot.bookedBy && (
                      <span className="text-xs text-gray-500">by {slot.bookedBy.name}</span>
                    )}
                  </div>
                  {slot.description && <p className="text-sm text-gray-400 mt-1">{slot.description}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!slot.isBooked && (
                    <>
                      <button onClick={() => toggleBlock(slot)}
                        title={slot.isBlocked ? 'Unblock slot' : 'Block slot'}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500">
                        {slot.isBlocked ? <Unlock size={14} /> : <Lock size={14} />}
                      </button>
                      <button onClick={() => deleteSlot(slot._id)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-50 text-gray-500 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Add Workshop Slot</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input type="date" className="input-field" {...register('date', { required: 'Date required' })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <input type="time" className="input-field" {...register('startTime', { required: 'Required' })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <input type="time" className="input-field" {...register('endTime', { required: 'Required' })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input className="input-field" placeholder="e.g. Batik intro class for beginners" {...register('description')} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                  {isSubmitting ? 'Adding...' : 'Add Slot'}
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
