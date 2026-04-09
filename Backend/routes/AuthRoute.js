import express from 'express';
import { Login, LogOut, Me, changePassword } from "../controllers/Auth.js";
import { verifyUser } from '../middleware/AuthUser.js';
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    message: { msg: "Too many login attempts. Please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

const router = express.Router();

router.get('/me', Me);
router.post('/login', loginLimiter, Login);
router.delete('/logout', LogOut);
router.patch('/change-password', verifyUser, changePassword);

export default router;
