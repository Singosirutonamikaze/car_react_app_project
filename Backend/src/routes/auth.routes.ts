import express from 'express';
import {userProtect } from '../middleware/authMiddleware';
import { registerUser, loginUser, getUserInfo } from '../controllers/authController';

const router = express.Router();

// Route to register a new user
router.post('/register', registerUser);

// Route to login a user
router.post('/api/version/admin/auth/login', loginUser);

router.post('/login', loginUser); 

router.get('/getUser', userProtect, getUserInfo);

export default router;
