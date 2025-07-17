import express from "express";
import { createUser , loginuser, loginWithGoogle, resetPassword, sendOTP, getUser } from "../controllers/userController.js";
import { get } from "mongoose";

const userRouter = express.Router(); 

userRouter.post("/", createUser);
userRouter.post("/login", loginuser);
userRouter.post("/login/google", loginWithGoogle); 
userRouter.post("/send-otp", sendOTP);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/", getUser);

export default userRouter;