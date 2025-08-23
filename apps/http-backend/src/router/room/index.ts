import express, { Router } from 'express';
import { createRoomController, getAllCanvas, getChats, getSlug } from '../../controller/room';
import { authMiddleware } from '../../middleware/authMiddleware';
const router : Router = express.Router();


router.post("/create-room", authMiddleware, createRoomController);
router.get("/get-room/:slug", authMiddleware, getSlug);
router.get("/get-chats/:roomId", authMiddleware, getChats);
router.get("/getRooms",authMiddleware,  getAllCanvas);


export default router