"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <h1 className={styles.logo}>💬 ChatApp</h1>
          <div className={styles.navButtons}>
            <button 
              className={styles.btnSecondary}
              onClick={() => router.push('/signin')}
            >
              Sign In
            </button>
            <button 
              className={styles.btnPrimary}
              onClick={() => router.push('/signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Connect & Chat
            <span className={styles.heroTitleAccent}> in Real-Time</span>
          </h1>
          <p className={styles.heroDescription}>
            Join chat rooms, connect with others, and experience seamless real-time messaging.
            Create your own rooms or join existing ones instantly.
          </p>
          <div className={styles.heroCTA}>
            <button 
              className={styles.btnPrimaryLarge}
              onClick={() => router.push('/signup')}
            >
              Get Started Free
            </button>
            <button 
              className={styles.btnSecondaryLarge}
              onClick={() => router.push('/signin')}
            >
              Sign In
            </button>
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🚀</div>
            <h3 className={styles.featureTitle}>Instant Messaging</h3>
            <p className={styles.featureDescription}>
              Real-time chat with WebSocket technology
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3 className={styles.featureTitle}>Secure & Private</h3>
            <p className={styles.featureDescription}>
              End-to-end encrypted conversations
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>👥</div>
            <h3 className={styles.featureTitle}>Multiple Rooms</h3>
            <p className={styles.featureDescription}>
              Create and join unlimited chat rooms
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
