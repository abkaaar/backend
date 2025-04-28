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

// student routes
router.post('/add', userVerification, addStudent);
router.get('/students', getStudents);
router.get('/:id', getStudent);
router.put('/:id', userVerification, updateStudent);
router.delete('/:id', userVerification, deleteStudent);


export default router;