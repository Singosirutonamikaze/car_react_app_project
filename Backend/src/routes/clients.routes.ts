// routes/clients.routes.js
import express from 'express';
import { getClients, createClient, updateClient, deleteClient, downloadClientsPDF } from '../controllers/clients.controller';
import { adminProtect } from '../middleware/authMiddleware';
const router = express.Router();

router.get('/get', adminProtect, getClients);

router.post('/create', adminProtect, createClient);

router.put('/update/', adminProtect, updateClient);

router.delete('/delete/:id', adminProtect, deleteClient);

router.get('/download', adminProtect, downloadClientsPDF);

export default router;