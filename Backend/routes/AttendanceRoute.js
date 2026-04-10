import express from 'express';
import {
    getAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceAnalytics
} from "../controllers/TransactionController.js";
import { adminOnly, verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/attendance', verifyUser, adminOnly, getAttendance);
router.get('/attendance/analytics', verifyUser, adminOnly, getAttendanceAnalytics);
router.post('/attendance', verifyUser, adminOnly, createAttendance);
router.patch('/attendance/update/:id', verifyUser, adminOnly, updateAttendance);
router.delete('/attendance/:id', verifyUser, adminOnly, deleteAttendance);

export default router;
