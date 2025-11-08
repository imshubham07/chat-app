"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BACKEND_URL } from '../cofig';

export default function CreateRoom() {
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      router.push('/signin');
    }
  }, [token, router]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/room`,
        { name: roomName },
        { headers: { Authorization: token } }
      );

      if (response.data.roomId) {
        const slug = roomName.toLowerCase().replace(/\s+/g, '-');
        router.push(`/room/${slug}`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err 
        ? (err as any).response?.data?.message 
        : 'Failed to create room';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-slate-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-lighter to-dark opacity-50"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(13, 148, 136, 0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <nav className="relative z-10 bg-dark-card/80 backdrop-blur-sm border-b border-primary/20 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-start items-center">
          <button 
            className="bg-dark-lighter text-primary border-2 border-primary/30 px-5 py-2.5 rounded-lg text-base font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
            onClick={() => router.push('/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto px-8 py-16">
        <div className="bg-dark-card border border-primary/20 rounded-2xl p-12 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🚀</div>
            <h1 className="text-4xl font-bold text-slate-100 mb-2">Create New Room</h1>
            <p className="text-slate-400 text-base">Start a new conversation space</p>
          </div>
          
          <form onSubmit={handleCreateRoom} className="flex flex-col gap-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-4 rounded-lg text-base">
                {error}
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-slate-300 text-base">Room Name</label>
              <input
                type="text"
                className="px-4 py-4 bg-dark-lighter border-2 border-primary/20 rounded-lg text-base text-slate-100 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 placeholder-slate-500"
                placeholder="Enter room name (e.g., General Chat)"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
              {roomName && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-500 text-sm">Room URL:</span>
                  <code className="text-primary text-sm bg-dark-lighter px-2 py-1 rounded">
                    /{roomName.toLowerCase().replace(/\s+/g, '-')}
                  </code>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-secondary text-white px-4 py-4 rounded-lg text-lg font-semibold transition-all mt-4 shadow-lg shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating...' : '✨ Create Room'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-dark-lighter/50 border border-primary/10 rounded-lg">
            <p className="text-sm text-slate-400 text-center">
              💡 Tip: Choose a descriptive name that others will recognize
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
