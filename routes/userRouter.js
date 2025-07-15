import express from "express";
import { createUser , loginuser, loginWithGoogle } from "../controllers/userController.js";

const userRouter = express.Router(); 

userRouter.post("/", createUser);
userRouter.post("/login", loginuser);
userRouter.post("/login/google", loginWithGoogle); 

export default userRouter;