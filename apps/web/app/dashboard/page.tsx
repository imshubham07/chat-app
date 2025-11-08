"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BACKEND_URL } from '../cofig';

interface Room {
  id: number;
  slug: string;
  adminId: string;
  createdAt: string;
  admin: {
    name: string;
    email: string;
  };
}

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token, logout } = useAuth();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/rooms`, {
        headers: { Authorization: token }
      });
      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push('/signin');
      return;
    }
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleJoinRoom = (slug: string) => {
    router.push(`/room/${slug}`);
  };

  const handleCreateRoom = () => {
    router.push('/create-room');
  };

  return (
    <div className="min-h-screen bg-dark text-slate-100">
      {/* Top Navbar */}
      <nav className="bg-dark-card border-b border-primary/20 px-6 py-4 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <h1 className="text-xl font-bold text-slate-100">WebChat</h1>
          </div>
          <button 
            className="bg-transparent text-red-400 border border-red-400/30 px-4 py-2 rounded-lg font-semibold hover:bg-red-500/10 hover:border-red-400 transition-all"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar */}
        <aside className="w-80 bg-dark-card border-r border-primary/20 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-primary/20">
            <h2 className="text-xl font-bold text-slate-100 mb-2">Your Rooms</h2>
            <p className="text-sm text-slate-400">Click to join a room</p>
          </div>

          {/* Rooms List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="text-center text-slate-400 py-8">Loading...</div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-slate-400 text-sm">No rooms yet</p>
                <p className="text-slate-500 text-xs mt-1">Create your first room below!</p>
              </div>
            ) : (
              rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleJoinRoom(room.slug)}
                  className="w-full text-left p-4 rounded-lg bg-dark-lighter border border-primary/10 hover:border-primary/30 hover:bg-dark-lighter/80 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-slate-100 font-semibold break-words group-hover:text-primary transition-colors">
                      {room.slug}
                    </h3>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {new Date(room.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    👤 {room.admin.name}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Create Room Button */}
          <div className="p-4 border-t border-primary/20">
            <button
              onClick={handleCreateRoom}
              className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-secondary text-white px-4 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-primary/20"
            >
              + Create New Room
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-12">
            {/* Welcome Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-extrabold text-slate-100 mb-4">
                Welcome to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Dashboard</span>
              </h1>
              <p className="text-xl text-slate-400">Manage your rooms and start conversations</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-dark-card border border-primary/20 rounded-xl p-6 text-center hover:border-primary/40 transition-all">
                <div className="text-4xl mb-3">�</div>
                <div className="text-3xl font-bold text-primary mb-1">{rooms.length}</div>
                <p className="text-slate-400 text-sm">Total Rooms</p>
              </div>
              <div className="bg-dark-card border border-primary/20 rounded-xl p-6 text-center hover:border-primary/40 transition-all">
                <div className="text-4xl mb-3">⚡</div>
                <div className="text-3xl font-bold text-secondary mb-1">Real-time</div>
                <p className="text-slate-400 text-sm">WebSocket Chat</p>
              </div>
              <div className="bg-dark-card border border-primary/20 rounded-xl p-6 text-center hover:border-primary/40 transition-all">
                <div className="text-4xl mb-3">🔒</div>
                <div className="text-3xl font-bold text-primary-light mb-1">Secure</div>
                <p className="text-slate-400 text-sm">JWT Protected</p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-card border border-primary/20 rounded-xl p-8 hover:border-primary/40 transition-all">
                <div className="text-4xl mb-4">�</div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">Quick Start</h3>
                <p className="text-slate-400 leading-relaxed">
                  Create a room to start chatting or ask someone to share their room link with you. All rooms appear in your sidebar for quick access.
                </p>
              </div>
              <div className="bg-dark-card border border-primary/20 rounded-xl p-8 hover:border-primary/40 transition-all">
                <div className="text-4xl mb-4">🔗</div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">Share & Collaborate</h3>
                <p className="text-slate-400 leading-relaxed">
                  Share your room slug with others so they can join your conversation. Perfect for team discussions and group chats.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
