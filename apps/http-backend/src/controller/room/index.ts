import { Request, Response } from "express"


export const createRoomController = (req : Request, res : Response) => {
    res.status(200).json({
        status : "success",
        roomCode : 12,
    })
}