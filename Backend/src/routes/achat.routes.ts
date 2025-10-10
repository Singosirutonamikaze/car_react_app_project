import express from 'express';
import { userProtect } from '../middleware/authMiddleware';
import { addEvaluationAchat, createAchat, getUserAchats, updateAchatStatus } from '../controllers/achatControllers'

const router = express.Router();

// Achats
router.get('/user/achats', userProtect, getUserAchats);

router.post('/user/achats', userProtect, createAchat);

router.put('/user/achats/:id/status', userProtect, updateAchatStatus);

router.post('/user/achats/:id/evaluation', userProtect, addEvaluationAchat);

export default router;
