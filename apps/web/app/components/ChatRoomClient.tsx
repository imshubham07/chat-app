"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../context/AuthContext";
import styles from './ChatRoom.module.css';

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
  const { token } = useAuth();
  const { socket, loading } = useSocket(token);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.roomInfo}>
            <h1 className={styles.roomTitle}>💬 {roomSlug}</h1>
            <p className={styles.roomSubtitle}>Room ID: {id}</p>
          </div>
          <button className={styles.leaveBtn} onClick={handleLeaveRoom}>
            ← Leave Room
          </button>
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {loading ? (
          <div className={styles.loading}>Connecting to chat...</div>
        ) : chats.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💭</div>
            <p className={styles.emptyText}>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className={styles.messagesList}>
            {chats.map((m, index) => (
              <div key={index} className={styles.messageWrapper}>
                <div className={styles.message}>
                  <div className={styles.messageContent}>{m.message}</div>
                  {m.userId && (
                    <div className={styles.messageFooter}>
                      <span className={styles.userId}>User: {m.userId.slice(0, 8)}...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type your message..."
            value={currentMessage}
            onChange={e => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSendMessage}
            disabled={loading || !currentMessage.trim()}
          >
            Send 📤
          </button>
        </div>
      </div>
    </div>
  )
}
