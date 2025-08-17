import express, { Router } from 'express';
import authRouter from '../auth/index'
import appRouter from "../room/index"

const router : Router = express.Router();

router.use("/auth", authRouter);
router.use("/app", appRouter);

export default router;