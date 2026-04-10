import express from 'express';
import { verifyUser, adminOnly } from '../middleware/AuthUser.js';
import {
    getLeaveTypes,
    applyLeave,
    getMyLeaves,
    getMyLeaveBalance,
    getAllLeaveRequests,
    reviewLeave
} from '../controllers/LeaveController.js';

const router = express.Router();

router.get('/leave/types', verifyUser, getLeaveTypes);
router.post('/leave/apply', verifyUser, applyLeave);
router.get('/leave/my-requests', verifyUser, getMyLeaves);
router.get('/leave/my-balance', verifyUser, getMyLeaveBalance);
router.get('/leave/requests', verifyUser, adminOnly, getAllLeaveRequests);
router.patch('/leave/review/:id', verifyUser, adminOnly, reviewLeave);

export default router;
