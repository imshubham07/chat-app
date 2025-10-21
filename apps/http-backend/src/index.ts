import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SignInSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient, Prisma } from "@repo/db/client";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const parseData = CreateUserSchema.safeParse(req.body);
    if (!parseData.success) {
      console.log(parseData);
      return res.status(400).json({
        message: "Incorrect Inputs",
      });
    }

    const hashedPassword = await bcrypt.hash(parseData.data.password, 10);
    const user = await prismaClient.user.create({
      data: {
        email: parseData.data.username,
        password: hashedPassword,
        name: parseData.data.name,
      },
    });

    res.json({
      userId: user.id,
      message: "User created successfully",
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        message: "User already exists with this username",
      });
    }
    console.error(error);
    res.status(500).json({
      message: "Internal server Error",
    });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const parseData = SignInSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status(400).json({
        message: "incorrect Inputs",
      });
    }
    const { username, password } = parseData.data;

    const user = await prismaClient.user.findUnique({
      where: { email: username },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email",
      });
    }

    const vaildPassword = await bcrypt.compare(password, user.password);
    if (!vaildPassword) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }
    console.log(user);
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);

    res.json({
      message: "User SignIn Sucessfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      messsage: "Internal Server Error",
    });
  }
});

app.post("/room", middleware, async (req, res) => {
  try {
    const parseData = CreateRoomSchema.safeParse(req.body);
    if (!parseData.success) {
      return res.status(400).json({
        message: "Incorrect Input",
      });
    }
    //@ts-ignore
    const userId = req.userId;

    const room = await prismaClient.room.create({
      data: {
        slug: parseData.data.name.toLowerCase().replace(/\s+/g, "-"), // safer slug
        adminId: userId,
      },
    });
    if (room) {
    }

    res.status(201).json({
      roomId: room.id,
      message: "Room created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    if (isNaN(roomId)) {
      return res.status(400).json({ message: "Invalid Room ID" });
    }

    const messages = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: { id: "desc" },
      take: 50,
    });

    res.json({ messages });
  } catch (error) {
    console.error("Chat fetch error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get("/room/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
   

    const room = await prismaClient.room.findFirst({
      where: { slug }
    });

    res.json({  room });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3001);
