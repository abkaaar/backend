import express from 'express';
const router = express.Router();
import { 
    addStudent, 
}  from '../controllers/StudentController.js';
import userVerification from '../middlewares/AuthMiddleware.js';

// department routes
router.post('/add', userVerification, addStudent);


export default router;