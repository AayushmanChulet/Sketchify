import jwt from "jsonwebtoken";
import { NextFunction, type Request, type Response } from "express";
import z from "zod"
import { AuthRequest } from "../types/auth";
import { JWT_SECRET } from "@repo/backend/config"


export const authMiddleware = async ( req : AuthRequest, res : Response, next : NextFunction ) => {

    const  token = req.headers.get("authorization") ?? ""  ;

    if(!token){
        return res.json(402).json({
            status : "failed",
            message: "Invalid request"
        })
    }

    try{
        const user = jwt.verify(token, JWT_SECRET);

        if(!user){
            throw new Error("Invalid token");
        }

        req.token = user as string;

        next();
    }catch(err : any){
        console.error("Something went off while checking token : " + err.message)
    }

}