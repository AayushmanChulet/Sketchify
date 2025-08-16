import express, { Router } from 'express';
import authRouter from '../auth/index'

const router : Router = express.Router();

router.get("/auth", authRouter);

export default router;