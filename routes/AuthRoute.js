import express from "express";
const router = express.Router();
import { Signup, Login } from "../controllers/userController.js";
import { verifyCode, updateUser, getUser } from "../controllers/userController.js";
import userVerification from "../middlewares/AuthMiddleware.js";


router.post("/register", Signup);
router.post("/login", Login);


router.post("/verify-otp", verifyCode);
router.put('/user/update', userVerification, updateUser);
router.get('/user', userVerification, getUser);



export default router;