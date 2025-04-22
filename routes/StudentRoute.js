import express from 'express';
const router = express.Router();
import { 
    addStudent, 
    deleteStudent, 
    getStudent,
    getStudents,
    updateStudent
}  from '../controllers/StudentController.js';

// department routes
router.post('/add', addStudent);
router.get('/:id', getStudent);
router.get('/students', getStudents);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);


export default router;