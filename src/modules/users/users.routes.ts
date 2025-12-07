import express, { request, Request, Response } from "express";
import { usersController } from "./users.controller";
import adminAuth from "../../middleware/adminAuth";
import userAuth from "../../middleware/userAuth";

const router = express.Router();

router.get("/", adminAuth(), usersController.getUsers);
router.put("/:userId", userAuth(), usersController.updateUser )
router.delete("/:userId", adminAuth(), usersController.deleteUser) 

export const usersRoutes = router;
