import express from 'express';
const router = express.Router();
import { 
    addDepartment, 
    updateDepartment, 
    deleteDepartment, 
    getAllDepartments,
    getDepartment
}  from '../controllers/DepartmentController.js';
import userVerification from '../middlewares/AuthMiddleware.js';

// department routes
router.post('/add', userVerification, addDepartment);
router.get('/departments', getAllDepartments);
router.get('/:id', getDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;