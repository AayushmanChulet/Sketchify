import express, { Router } from 'express';
import { createRoomController } from '../../controller/room';
const router : Router = express.Router();


router.get("/create-room", createRoomController);


export default router