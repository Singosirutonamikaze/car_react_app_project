import express from 'express';
import {userProtect } from '../middleware/authMiddleware';
import { registerUser, loginUser, getUserInfo } from '../controllers/authController';
import { deleteClient, updateClient } from '../controllers/clients.controller';

const router = express.Router();

// Route to register a new user
router.post('/register', registerUser);

// Route to login a user
router.post('/api/version/admin/auth/login', loginUser);

router.post('/login', loginUser); 

router.get('/getUser', userProtect, getUserInfo);

router.put('/updateUser', userProtect, updateClient);

router.delete('/delete/myaccount/:id', userProtect, deleteClient);

router.put('/update/password', userProtect, updateClient);

router.post('/forgot/password', updateClient);

export default router;
