import express from 'express';
import {
    getSalaryReport,
    getSalarySlip,
    getEmployeeSalaryHistory
} from '../controllers/SalaryController.js';
import { verifyUser, adminOnly, employeeOnly } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/salary/report', verifyUser, adminOnly, getSalaryReport);
router.get('/salary/slip/:id', verifyUser, adminOnly, getSalarySlip);
router.get('/salary/my-history', verifyUser, getEmployeeSalaryHistory);

export default router;
