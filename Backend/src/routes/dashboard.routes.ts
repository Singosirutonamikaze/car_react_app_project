import express from 'express';
import { getDashboardData } from '../controllers/dashboardController';
import { adminProtect } from '../middleware/authMiddleware';
const router = express.Router();


router.get('/', adminProtect, getDashboardData);

export default router;