import express from "express";
import { createUser , loginuser, loginWithGoogle, resetPassword, sendOTP } from "../controllers/userController.js";

const userRouter = express.Router(); 

userRouter.post("/", createUser);
userRouter.post("/login", loginuser);
userRouter.post("/login/google", loginWithGoogle); 
userRouter.post("/send-otp", sendOTP);
userRouter.post("/reset-password", resetPassword);

export default userRouter;