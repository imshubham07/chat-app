"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-lighter to-dark opacity-50"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(13, 148, 136, 0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Navbar */}
      <nav className="relative z-10 sticky top-0 backdrop-blur-md bg-dark/80 border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">💬</span>
            <h1 className="text-2xl font-bold text-slate-100">WebChat</h1>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-slate-300 hover:text-primary transition-colors">Features</a>
            <a href="https://github.com/imshubham07" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-primary transition-colors">GitHub</a>
            <button 
              className="text-slate-300 hover:text-primary transition-colors font-medium"
              onClick={() => router.push('/signin')}
            >
              Sign In
            </button>
            <button 
              className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-primary/20"
              onClick={() => router.push('/signup')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-24 text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium mb-8">
              🚀 Real-time WebSocket Technology
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-slate-100 mb-6 leading-tight">
            Real-time Conversations.
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Simplified.
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect instantly, create rooms, and chat seamlessly. Experience the future of real-time communication with WebChat.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-secondary text-white px-10 py-4 rounded-lg text-lg font-bold transition-all shadow-2xl shadow-primary/30 hover:-translate-y-1"
              onClick={() => router.push('/signup')}
            >
              Get Started
            </button>
            <button 
              className="bg-dark-card border-2 border-primary/30 text-slate-100 px-10 py-4 rounded-lg text-lg font-bold hover:border-primary hover:bg-dark-lighter transition-all"
              onClick={() => router.push('/signin')}
            >
              Sign In
            </button>
          </div>

          {/* Animated Chat Bubbles Illustration */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto opacity-60">
              <div className="bg-primary/20 border border-primary/30 rounded-2xl p-4 text-left backdrop-blur-sm">
                <div className="w-8 h-8 bg-primary rounded-full mb-2"></div>
                <div className="h-2 bg-primary/40 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-primary/40 rounded w-1/2"></div>
              </div>
              <div className="bg-secondary/20 border border-secondary/30 rounded-2xl p-4 text-left backdrop-blur-sm mt-8">
                <div className="w-8 h-8 bg-secondary rounded-full mb-2"></div>
                <div className="h-2 bg-secondary/40 rounded w-2/3 mb-2"></div>
                <div className="h-2 bg-secondary/40 rounded w-4/5"></div>
              </div>
              <div className="bg-primary/20 border border-primary/30 rounded-2xl p-4 text-left backdrop-blur-sm mt-4">
                <div className="w-8 h-8 bg-primary-light rounded-full mb-2"></div>
                <div className="h-2 bg-primary/40 rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-primary/40 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Powerful Features</h2>
            <p className="text-slate-400 text-lg">Everything you need for seamless real-time communication</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-card border border-primary/20 p-8 rounded-2xl hover:border-primary/50 transition-all hover:-translate-y-2 group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">�</div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3">Real-time Messaging</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Instant message delivery powered by WebSocket technology. Experience lag-free conversations.
              </p>
            </div>
            <div className="bg-dark-card border border-secondary/20 p-8 rounded-2xl hover:border-secondary/50 transition-all hover:-translate-y-2 group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🔒</div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3">Secure Authentication</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                JWT-based authentication ensures your conversations remain private and secure.
              </p>
            </div>
            <div className="bg-dark-card border border-primary/20 p-8 rounded-2xl hover:border-primary/50 transition-all hover:-translate-y-2 group">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3">Fast & Scalable</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Built with Prisma and Node.js backend for lightning-fast performance at scale.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-primary/20 bg-dark-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 py-12 text-center">
            <p className="text-slate-400 mb-4">Built by <span className="text-primary font-semibold">Shubham Kumar Dubey</span></p>
            <div className="flex justify-center gap-6">
              <a href="https://github.com/imshubham07" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                GitHub
              </a>
              <a href="https://linkedin.com/in/imshubham07" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                LinkedIn
              </a>
            </div>
            <p className="text-slate-500 text-sm mt-6">© 2025 WebChat. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
