const express = require('express');
const router = express.Router();
const auth = require('../middlewares/AuthMiddleware');
const { 
    addDepartment, 
    getDepartments, 
    getDepartmentById, 
    updateDepartment, 
    deleteDepartment 
} = require('../controllers/DepartmentController');

// department routes
router.post('/add', auth.userVerification, addDepartment);
router.get('/', auth.userVerification, getDepartments);
router.get('/:id', auth.userVerification, getDepartmentById);
router.put('/:id', auth.userVerification, updateDepartment);
router.delete('/:id', auth.userVerification, deleteDepartment);

module.exports = router;