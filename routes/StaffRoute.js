import express from 'express';
const router = express.Router();

import userVerification from '../middlewares/AuthMiddleware.js';
import { addStaff, deleteStaff, getStaff, getStaffs, updateStaff } from '../controllers/StaffController.js';

// staff routes
router.post('/add', userVerification, addStaff);
router.get('/staffs', getStaffs);
router.get('/:id', getStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);


export default router;