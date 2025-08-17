import express, { Router } from 'express';
import { createRoomController, getChats, getSlug } from '../../controller/room';
import { authMiddleware } from '../../middleware/authMiddleware';
const router : Router = express.Router();


router.get("/create-room", authMiddleware, createRoomController);
router.get("/get-room/:slug", authMiddleware, getSlug);
router.get("/get-chats/:roomId", authMiddleware, getChats);


export default router