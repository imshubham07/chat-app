"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../context/AuthContext";

export function ChatRoomClient({
  messages,
  id,
  roomSlug
}: {
  messages: { message: string; userId?: string }[];
  id: string;
  roomSlug: string;
}) {
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { token } = useAuth();
  const { socket, loading } = useSocket(token);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Decode JWT to get current user ID
  useEffect(() => {
    if (!token) return;
    const parts = token.split('.');
    if (parts.length < 2) return; // malformed token
    const middle: string = parts[1] || ""; // ensure string for atob
    if (!middle) return;
    try {
      const payload: { userId?: string } = JSON.parse(atob(middle));
      if (payload.userId) setCurrentUserId(payload.userId);
    } catch {
      // silently ignore decode errors
    }
  }, [token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    if (socket && !loading) {
      socket.send(JSON.stringify({
        type: "join_room",
        roomId: id
      }));

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats(c => [...c, { message: parsedData.message, userId: parsedData.senderId }])
        }
      }
    }

    return () => {
      if (socket) {
        socket.send(JSON.stringify({
          type: "leave_room",
          roomId: id
        }));
      }
    };
  }, [socket, loading, id]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    socket?.send(JSON.stringify({
      type: "chat",
      roomId: id,
      message: currentMessage
    }));
    setCurrentMessage("");
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.send(JSON.stringify({
        type: "leave_room",
        roomId: id
      }));
    }
    router.push('/dashboard');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-dark text-slate-100">
      {/* Header */}
      <div className="bg-dark-card border-b border-primary/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">💬</span>
              <h1 className="text-xl font-bold text-slate-100">{roomSlug}</h1>
            </div>
            <p className="text-xs text-slate-500">Room ID: {id.slice(0, 8)}...</p>
          </div>
          <button 

className="bg-dark-lighter text-primary border-2 border-primary/30 px-6 py-2 rounded-lg font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all"
            onClick={handleLeaveRoom}
          >
            ← Leave Room
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-pulse text-4xl">💬</div>
              <p>Connecting to chat...</p>
            </div>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <div className="text-6xl mb-4">💭</div>
            <p className="text-lg">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-3">
            {chats.map((m, index) => {
              const isOwnMessage = m.userId === currentUserId;
              return (
                <div 
                  key={index} 
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`rounded-2xl px-5 py-3 max-w-2xl shadow-lg ${
                      isOwnMessage 
                        ? 'bg-linear-to-r from-primary to-primary-light text-white' 
                        : 'bg-dark-card border border-primary/20 text-slate-100'
                    }`}
                  >
                    <div className="text-base leading-relaxed">{m.message}</div>
                    {m.userId && (
                      <div className={`mt-2 pt-2 border-t ${isOwnMessage ? 'border-white/20' : 'border-primary/20'}`}>
                        <span className={`text-xs ${isOwnMessage ? 'text-white/80' : 'text-slate-500'}`}>
                          {isOwnMessage ? 'You' : `User: ${m.userId.slice(0, 8)}...`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-dark-card border-t border-primary/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex gap-4">
            <input
              type="text"
              className="flex-1 px-6 py-4 bg-dark-lighter border-2 border-primary/20 rounded-xl text-base text-slate-100 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed placeholder-slate-500"
              placeholder="Type your message..."
              value={currentMessage}
              onChange={e => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button
              className="bg-linear-to-r from-primary to-primary-light hover:from-primary-light hover:to-secondary text-white px-8 py-4 rounded-xl text-base font-semibold transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendMessage}
              disabled={loading || !currentMessage.trim()}
            >
              Send 📤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
