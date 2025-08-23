// routes/adminRoutes.ts
import express from 'express';
import { login, getProfile, changePassword } from '../controllers/adminControllers';
import { adminAuth } from '../middleware/adminMiddleware';


const router = express.Router();

// Routes d'authentification
router.post('/auth/login', login);
router.get('/auth/profile', adminAuth, getProfile);
router.put('/auth/change-password', adminAuth, changePassword);


export default router;