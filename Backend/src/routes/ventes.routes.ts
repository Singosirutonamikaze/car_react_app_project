import express from 'express';
import {
  getAllVentes,
  getVenteById,
  createVente,
  updateVente,
  deleteVente,
  updateVenteStatus,
  getVentesStats,
  downloadVente
} from '../controllers/ventesController';
import { adminProtect } from '../middleware/authMiddleware';

const router = express.Router();

// Routes pour les ventes
router.get('/get', adminProtect, getAllVentes);
router.get('/stats', adminProtect, getVentesStats);
router.get('/export', adminProtect, downloadVente);
router.get('/:id', adminProtect, getVenteById);
router.post('/create', adminProtect, createVente);
router.put('/:id', adminProtect, updateVente);
router.patch('/:id/status', adminProtect, updateVenteStatus);
router.delete('/:id', adminProtect, deleteVente);

export default router;