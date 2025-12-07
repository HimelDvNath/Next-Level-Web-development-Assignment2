import express from 'express';
import { authController } from './auth.controller';


const router = express.Router();

router.post("/signup", authController.createUser);
router.post("/signin", authController.userLogIn);

export const authRoutes = router;