import express from 'express';
import {
    getDeductions,
    getDeductionById,
    createDeduction,
    updateDeduction,
    deleteDeduction
} from '../controllers/SalaryDeductionController.js';
import { verifyUser, adminOnly } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/salary-deductions', verifyUser, adminOnly, getDeductions);
router.get('/salary-deductions/:id', verifyUser, adminOnly, getDeductionById);
router.post('/salary-deductions', verifyUser, adminOnly, createDeduction);
router.patch('/salary-deductions/:id', verifyUser, adminOnly, updateDeduction);
router.delete('/salary-deductions/:id', verifyUser, adminOnly, deleteDeduction);

export default router;
