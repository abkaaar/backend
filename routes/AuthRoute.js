const express = require("express");
const router = express.Router();
const {Signup, Login, forgotPassword, resetPassword } = require("../controllers/userController");
const {userVerification, isHost} = require("../middlewares/AuthMiddleware")
const user = require('../controllers/userController')
 

router.post("/register", Signup);
router.post("/login", Login);
router.put('/user/update', userVerification, user.updateUser);
router.get('/user', userVerification, user.getUser);
// router.post('/dashboard', userVerification);
// router.put('/payment', userVerification, user.Payment);
// router.route("/forgotpassword").post(forgotPassword);
// router.route("/passwordreset/:resetToken").put(resetPassword);


module.exports = router;