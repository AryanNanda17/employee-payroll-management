import express from 'express';
import {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from '../controllers/EmployeeController.js';
import { adminOnly, verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/employees', verifyUser, adminOnly, getEmployees);
router.get('/employees/:id', verifyUser, adminOnly, getEmployeeById);
router.post('/employees', verifyUser, adminOnly, createEmployee);
router.patch('/employees/:id', verifyUser, adminOnly, updateEmployee);
router.delete('/employees/:id', verifyUser, adminOnly, deleteEmployee);

export default router;
