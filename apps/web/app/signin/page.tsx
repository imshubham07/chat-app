"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BACKEND_URL } from '../cofig';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setToken } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/signin`, {
        username,
        password,
      });

      if (response.data.token) {
        setToken(response.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-lighter to-dark opacity-50"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(13, 148, 136, 0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-dark-card border border-primary/20 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-4xl">💬</span>
              <h1 className="text-3xl font-bold text-slate-100">WebChat</h1>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to continue to your account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block font-semibold text-slate-300">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-dark-lighter border-2 border-primary/20 rounded-lg text-base text-slate-100 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 placeholder-slate-500"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-slate-300">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-dark-lighter border-2 border-primary/20 rounded-lg text-base text-slate-100 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 placeholder-slate-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-secondary text-white px-4 py-3 rounded-lg text-base font-semibold transition-all shadow-lg shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-slate-400">
              Don&apos;t have an account?{' '}
              <button 
                className="text-primary font-semibold hover:text-primary-light transition-colors" 
                onClick={() => router.push('/signup')}
              >
                Sign Up
              </button>
            </p>
            <button 
              className="text-slate-500 hover:text-primary font-medium transition-colors" 
              onClick={() => router.push('/')}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
