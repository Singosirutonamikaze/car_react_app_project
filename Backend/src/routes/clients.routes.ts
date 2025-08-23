import express from 'express';
import { getClients, createClient, updateClient, deleteClient } from '../controllers/clients.controller';
import { adminProtect } from '../middleware/authMiddleware';
const router = express.Router();

router.get('/get', adminProtect, getClients);

router.post('/create', adminProtect, createClient);

router.put('/update', adminProtect, updateClient);

router.delete('/delete/:id', adminProtect, deleteClient);

export default router;