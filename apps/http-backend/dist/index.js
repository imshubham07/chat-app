"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("@repo/backend-common/config");
const middleware_1 = require("./middleware");
const types_1 = require("@repo/common/types");
const client_1 = require("@repo/db/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/signup", async (req, res) => {
    try {
        const parseData = types_1.CreateUserSchema.safeParse(req.body);
        if (!parseData.success) {
            // console.log(parseData);
            return res.status(400).json({
                message: "Incorrect Inputs",
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(parseData.data.password, 10);
        const user = await client_1.prismaClient.user.create({
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
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002") {
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
        const parseData = types_1.SignInSchema.safeParse(req.body);
        if (!parseData.success) {
            return res.status(400).json({
                message: "incorrect Inputs",
            });
        }
        const { username, password } = parseData.data;
        const user = await client_1.prismaClient.user.findUnique({
            where: { email: username },
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email",
            });
        }
        const vaildPassword = await bcrypt_1.default.compare(password, user.password);
        if (!vaildPassword) {
            return res.status(401).json({
                message: "Invalid Password",
            });
        }
        // console.log(user);
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, config_1.JWT_SECRET);
        res.json({
            message: "User SignIn Sucessfully",
            token,
        });
    }
    catch (error) {
        res.status(500).json({
            messsage: "Internal Server Error",
        });
    }
});
app.post("/room", middleware_1.middleware, async (req, res) => {
    try {
        const parseData = types_1.CreateRoomSchema.safeParse(req.body);
        if (!parseData.success) {
            return res.status(400).json({
                message: "Incorrect Input",
            });
        }
        //@ts-ignore
        const userId = req.userId;
        const room = await client_1.prismaClient.room.create({
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
    }
    catch (error) {
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
        const messages = await client_1.prismaClient.chat.findMany({
            where: { roomId },
            orderBy: { id: "desc" },
            take: 50,
        });
        res.json({ messages });
    }
    catch (error) {
        console.error("Chat fetch error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.get("/rooms", middleware_1.middleware, async (req, res) => {
    try {
        const rooms = await client_1.prismaClient.room.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                admin: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
        res.json({ rooms });
    }
    catch (error) {
        console.error("Fetch rooms error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.get("/room/:slug", async (req, res) => {
    try {
        const slug = req.params.slug;
        const room = await client_1.prismaClient.room.findFirst({
            where: { slug }
        });
        res.json({ room });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.listen(3001);
