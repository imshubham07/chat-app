"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = middleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@repo/backend-common/config");
function middleware(req, res, next) {
    try {
        const authHeader = req.headers["authorization"] ?? "";
        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization header missing"
            });
        }
        // Extract token from "Bearer <token>" format
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        if (!token) {
            return res.status(401).json({
                message: "Token missing"
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (decoded) {
            //@ts-ignore 
            req.userId = decoded.userId;
            next();
        }
        else {
            res.status(403).json({
                message: "Unauthorized"
            });
        }
    }
    catch (error) {
        console.error('JWT verification error:', error);
        res.status(401).json({
            message: "Invalid token"
        });
    }
}
