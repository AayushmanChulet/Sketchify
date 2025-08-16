import express, { Router } from 'express';
import { signinController, signupController } from '../../controller/auth';

const router : Router = express.Router();

router.post("/signin", signinController);
router.post("/signup", signupController);

export default router;