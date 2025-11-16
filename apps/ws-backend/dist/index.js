"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@repo/backend-common/config");
const client_1 = require("@repo/db/client");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const users = new Map();
// Verify JWT safely
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        return decoded.userId ?? null;
    }
    catch {
        return null;
    }
}
// Safe broadcast helper
function broadcast(roomId, data) {
    const payload = JSON.stringify(data);
    for (const { ws, rooms } of users.values()) {
        if (rooms.has(roomId) && ws.readyState === ws_1.WebSocket.OPEN) {
            try {
                ws.send(payload);
            }
            catch (err) {
                console.error("Broadcast error:", err);
            }
        }
    }
}
wss.on("connection", (ws, request) => {
    try {
        const url = request.url;
        if (!url) {
            console.error("WS: Missing request URL");
            return ws.close(1002, "Bad request");
        }
        const query = new URLSearchParams(url.split("?")[1]);
        const token = query.get("token");
        if (!token) {
            console.error("WS: Missing token query param");
            return ws.close(1008, "Missing token");
        }
        const userId = verifyToken(token);
        if (!userId) {
            console.error("WS: Invalid token");
            return ws.close(1008, "Invalid token");
        }
        const user = { ws, userId, rooms: new Set() };
        users.set(ws, user);
        console.log(`✅ WS: User ${userId} connected (${users.size} active)`);
        // ---- Message Handling ----
        ws.on("message", async (raw) => {
            try {
                const msg = JSON.parse(raw.toString());
                switch (msg.type) {
                    case "join_room": {
                        const roomId = String(msg.roomId); // Convert to string
                        if (!roomId)
                            return;
                        user.rooms.add(roomId);
                        // console.log(`👥 User ${userId} joined room ${roomId}`);
                        break;
                    }
                    case "leave_room": {
                        const roomId = String(msg.roomId); // Convert to string
                        if (!roomId)
                            return;
                        user.rooms.delete(roomId);
                        // console.log(`🚪 User ${userId} left room ${roomId}`);
                        break;
                    }
                    case "chat": {
                        const { roomId: rawRoomId, message } = msg;
                        const roomId = String(rawRoomId); // Convert to string
                        if (!message || typeof message !== "string")
                            return;
                        const numericRoomId = Number(roomId);
                        if (isNaN(numericRoomId))
                            return;
                        // Check if user joined the room first
                        if (!user.rooms.has(roomId)) {
                            // console.log("❌ User not in room");
                            return;
                        }
                        // validate room
                        const room = await client_1.prismaClient.room.findUnique({
                            where: { id: numericRoomId },
                        });
                        // console.log("i ham here", room);
                        if (!room)
                            return;
                        // console.log("📨 Chat message received:", msg);
                        await client_1.prismaClient.chat.create({
                            data: { roomId: numericRoomId, message, userId },
                        });
                        broadcast(roomId, {
                            type: "chat",
                            roomId,
                            message,
                            senderId: userId,
                            timestamp: Date.now(),
                        });
                        break;
                    }
                    default:
                        console.warn("⚠️ Unknown message type:", msg.type);
                }
            }
            catch (err) {
                console.error("❌ Error handling message:", err);
                // optional: send error to client
                if (ws.readyState === ws_1.WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: "error", message: "Invalid request" }));
                }
            }
        });
        ws.on("close", (code, reason) => {
            users.delete(ws);
            console.log(`❌ WS: User ${userId} disconnected (${users.size} active) code=${code} reason=${reason}`);
        });
        ws.on("error", (err) => {
            console.error("WS error:", err);
            ws.close();
        });
    }
    catch (err) {
        console.error("Connection error:", err);
        ws.close();
    }
});
