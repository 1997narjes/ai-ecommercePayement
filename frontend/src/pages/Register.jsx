import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16 flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-600/20 border border-amber-700/50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            ☕
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-500 mt-2">Join the CoffeeBrand community</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {error && (
            <div className="bg-red-900/20 border border-red-700/50 text-red-400 p-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
              <input type="text" placeholder="Narjes Khenessi"
                className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-xl focus:outline-none focus:border-amber-600 transition placeholder-gray-600"
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <input type="email" placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-xl focus:outline-none focus:border-amber-600 transition placeholder-gray-600"
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <input type="password" placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-xl focus:outline-none focus:border-amber-600 transition placeholder-gray-600"
                onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-all">
              {loading ? '⏳ Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}