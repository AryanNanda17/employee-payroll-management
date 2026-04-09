import express from 'express';
import { verifyUser, adminOnly } from '../middleware/AuthUser.js';
import {
    processPayroll,
    getPayrollRecords,
    getPayrollStatus,
    getProcessedMonths,
    markAsPaid,
    getMyPayrollHistory
} from '../controllers/PayrollController.js';

const router = express.Router();

router.post('/payroll/process', verifyUser, adminOnly, processPayroll);
router.get('/payroll/records', verifyUser, adminOnly, getPayrollRecords);
router.get('/payroll/status', verifyUser, adminOnly, getPayrollStatus);
router.get('/payroll/processed-months', verifyUser, adminOnly, getProcessedMonths);
router.patch('/payroll/mark-paid', verifyUser, adminOnly, markAsPaid);
router.get('/payroll/my-history', verifyUser, getMyPayrollHistory);

export default router;
