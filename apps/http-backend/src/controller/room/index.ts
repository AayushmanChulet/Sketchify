import {  Response } from "express"
import { AuthRequest } from "../../types/auth"
import { client } from "@repo/database/client";
import { room } from "@repo/common/types";


export const createRoomController = async (req : AuthRequest, res : Response) => {
    
    const { success, data } = room.safeParse(req.body);

    if(!success){
        return res.status(402).json({
        status: "failed",
        message: "Invalid request",
        });
    }

    const { slug } = data;
    const userId = req.token;

    console.log(userId);


    if(!userId){
        return res.status(400).json({
            status :"failed",
            message : "userId not found"
        })
    }

    try{

        const newRoom = await client.room.create({
            data : {
                slug,
                adminId : userId
            }
        })

        res.status(200).json({
            status : "success",
            roomCode : newRoom.id,
            message:"room created successfully"
        })
        
    }catch (err){
        console.log(err)
        res.status(411).json({
            status : "failed",
            roomCode : "",
            message: "already present room with same slug"
        })
    }
}

export const getSlug = async (req : AuthRequest, res :Response) => {

    const { slug } = req.params;

    try{
        const room = await client.room.findFirstOrThrow({
            where : {
                slug
            }
        })

        if(!room){
            return res.status(411).json({
            status : "failed",
            roomCode : "",
            message: "room does not exist"
        })}

        res.status(200).json({
            status : "success",
            roomCode : room.id,
            message:"Room id found"
        })
        
    }catch(err) {
        res.status(411).json({
            status : "failed",
            roomCode : "",
            message : "Something went wrong"
        })
    }
}


export const getChats = async (req : AuthRequest, res :Response) => {
    const { roomId } = req.params;

    if(!roomId) {
        return res.status(400).json({
            status :"failed",
            message : "room id not found"
        })
    }

    try{
        const chats = await client.chat.findMany({
            where : {
                roomId : Number(roomId),
            },
            orderBy : {
                id : "desc"
            },
            take : 100
        })

        res.status(200).json({
            status : "success",
            messages : chats,
            message:"Chats generated"
        })
        
    }catch(err) {
        res.status(411).json({
            status : "failed",
            roomCode : [],
            message : "Something went wrong"
        })
    }
}

export const getAllCanvas = async (req : AuthRequest , res : Response ) => {
    const user = req.token;

    if(!user){
        return res.status(400).json({
            status :"failed",
            message : "auth token not found"
        })
    }

    const rooms = await client.room.findMany({
      where: {
        adminId: user
      },
      select: {
        id: true,
        slug: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(rooms);
    res.status(200).json({
        status:"success",
        rooms: rooms
    })
}