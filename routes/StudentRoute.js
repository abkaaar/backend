import express from 'express';
const router = express.Router();
import { 
    addStudent, 
    deleteStudent, 
    getStudent,
    getStudents,
    updateStudent
}  from '../controllers/StudentController.js';
import userVerification from '../middlewares/AuthMiddleware.js';

// department routes
router.post('/add', userVerification, addStudent);
router.get('/:id', userVerification, getStudent);
router.get('/students', userVerification, getStudents);
router.put('/:id', userVerification, updateStudent);
router.delete('/:id', userVerification, deleteStudent);


export default router;