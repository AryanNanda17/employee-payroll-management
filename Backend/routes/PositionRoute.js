import express from 'express';
import {
    getPositions,
    createPosition,
    updatePosition,
    deletePosition
} from "../controllers/PositionController.js";
import { adminOnly, verifyUser } from '../middleware/AuthUser.js'

const router = express.Router();

router.get('/positions', verifyUser, adminOnly, getPositions);
router.post('/positions', verifyUser, adminOnly, createPosition);
router.patch('/positions/:id', verifyUser,  adminOnly, updatePosition);
router.delete('/positions/:id', verifyUser, adminOnly, deletePosition);

export default router;
