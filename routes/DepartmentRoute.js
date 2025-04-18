import express from 'express';
const router = express.Router();
import { 
    addDepartment, 
    updateDepartment, 
    deleteDepartment, 
    getAllDepartments,
    getDepartment
}  from '../controllers/DepartmentController.js';

// department routes
router.post('/add', addDepartment);
router.get('/', getAllDepartments);
router.get('/:id', getDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;