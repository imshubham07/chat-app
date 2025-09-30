import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {prismaClient} from "@repo/db/client"

const wss = new WebSocketServer({ port: 8080 });

// that is the ugly way to do state mangement
interface User {
  ws: import("ws").WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  } catch {
    return null;
  }
}

wss.on("connection", function (ws, request) {
  const url = request.url;

  if (!url) {
    return;
  }
  const queryPramms = new URLSearchParams(url.split("?")[1]);
  const token = queryPramms.get("token");
  if (!token) {
    ws.close();
    return;
  }
  const userId = checkUser(token);

  if (userId == null) {
    ws.close();
    return;
  }
  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message",async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
      // room id exist  user exsist
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter((x) => x === parsedData.room);
    }

    if (parsedData.type==="chat") {
      const roomId =  parsedData.roomId;
      const message =  parsedData.message;

      await prismaClient.chat.create({
        data:{
          roomId,
          message,
          userId
        }
      })

      users.forEach(user=>{
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type:"chat",
            message:message,
            roomId
          }))
        }
      })
    }
  });
});
