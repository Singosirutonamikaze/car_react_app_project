import express from 'express';
import { userProtect } from '../middleware/authMiddleware';
import { getUserData, getUserDataCompatible, getUserDataEnhanced, getUserDataLight, getUserDataPaginated, updateUserProfile } from '../controllers/authController';

const router = express.Router();


router.get('/userData', userProtect, getUserData);

router.get('/user/enhanced', userProtect, getUserDataEnhanced);

router.put('/user/update-profile', userProtect, updateUserProfile);

router.get('/user', userProtect, getUserData);

router.get('/user/enhanced', userProtect, getUserDataEnhanced);

router.get('/user/light', userProtect, getUserDataLight);

router.get('/user/paginated', userProtect, getUserDataPaginated);

router.get('/user/compatible', userProtect, getUserDataCompatible);

router.get('/user/profile', userProtect, getUserDataLight);


export default router;
