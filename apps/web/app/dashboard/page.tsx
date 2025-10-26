"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BACKEND_URL } from '../cofig';
import styles from './dashboard.module.css';

interface Room {
  id: number;
  slug: string;
  adminId: string;
}

export default function Dashboard() {
  const [roomName, setRoomName] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();
  const { token, logout } = useAuth();

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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleJoinRoom = (slug: string) => {
    router.push(`/room/${slug}`);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <h1 className={styles.logo}>💬 ChatApp</h1>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Welcome to Your Dashboard</h1>
          <p className={styles.subtitle}>Create a new room or join an existing one</p>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.createBtn}
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? '✕ Cancel' : '+ Create New Room'}
          </button>
        </div>

        {showCreateForm && (
          <div className={styles.createRoomCard}>
            <h2 className={styles.cardTitle}>Create New Room</h2>
            <form onSubmit={handleCreateRoom} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}
              
              <div className={styles.inputGroup}>
                <label className={styles.label}>Room Name</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter room name (e.g., General Chat)"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                />
                <p className={styles.hint}>
                  Room URL will be: /{roomName.toLowerCase().replace(/\s+/g, '-')}
                </p>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Room'}
              </button>
            </form>
          </div>
        )}

        <div className={styles.joinSection}>
          <h2 className={styles.sectionTitle}>Join a Room</h2>
          <p className={styles.sectionSubtitle}>Enter a room slug to join instantly</p>
          
          <div className={styles.joinCard}>
            <input
              type="text"
              className={styles.joinInput}
              placeholder="Enter room slug (e.g., general-chat)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const slug = (e.target as HTMLInputElement).value;
                  if (slug) handleJoinRoom(slug);
                }
              }}
            />
            <button
              className={styles.joinBtn}
              onClick={() => {
                const input = document.querySelector(`.${styles.joinInput}`) as HTMLInputElement;
                if (input.value) handleJoinRoom(input.value);
              }}
            >
              Join Room →
            </button>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>💡</div>
            <h3 className={styles.infoTitle}>Quick Start</h3>
            <p className={styles.infoText}>
              Create a room to start chatting or ask someone to share their room link with you
            </p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🔗</div>
            <h3 className={styles.infoTitle}>Share Links</h3>
            <p className={styles.infoText}>
              Share your room slug with others so they can join your conversation
            </p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>⚡</div>
            <h3 className={styles.infoTitle}>Real-time</h3>
            <p className={styles.infoText}>
              All messages are delivered instantly using WebSocket technology
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
