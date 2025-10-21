import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req:Request, res:Response, next:NextFunction ){
    try {
        const authHeader = req.headers["authorization"]?? ""
        
        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization header missing"
            })
        }
        
        // Extract token from "Bearer <token>" format
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

        if (!token) {
            return res.status(401).json({
                message: "Token missing"
            })
        }

        const decoded = jwt.verify(token, JWT_SECRET) 

        if(decoded){
            //@ts-ignore 
            req.userId = decoded.userId
            next()
        }else{
            res.status(403).json({
                message:"Unauthorized"
            })
        }
    } catch (error) {
        console.error('JWT verification error:', error);
        res.status(401).json({
            message: "Invalid token"
        })
    }
}