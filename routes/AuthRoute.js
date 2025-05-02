import express from "express";
const router = express.Router();
import { Signup, Login, forgetPassword, resetPassword } from "../controllers/userController.js";
import { verifyCode, updateUser, getUser } from "../controllers/userController.js";
import userVerification from "../middlewares/AuthMiddleware.js";


router.post("/register", Signup);
router.post("/login", Login);
router.post("/verify-otp", verifyCode);
router.put('/user/update', userVerification, updateUser);
router.get('/user', userVerification, getUser);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);



export default router;