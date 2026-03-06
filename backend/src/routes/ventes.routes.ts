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

/**
 * @swagger
 * /api/admin/ventes/get:
 *   get:
 *     summary: Lister toutes les ventes (avec filtres)
 *     tags: [Ventes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [En attente, Confirmée, Payée, Annulée]
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Liste des ventes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: integer }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vente'
 *       401:
 *         description: Non autorisé
 */
router.get('/get', adminProtect, getAllVentes);

/**
 * @swagger
 * /api/admin/ventes/stats:
 *   get:
 *     summary: Statistiques globales des ventes
 *     tags: [Ventes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques des ventes
 */
router.get('/stats', adminProtect, getVentesStats);

/**
 * @swagger
 * /api/admin/ventes/export:
 *   get:
 *     summary: Exporter les ventes en PDF
 *     tags: [Ventes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Fichier PDF
 *         content:
 *           application/pdf:
 *             schema: { type: string, format: binary }
 */
router.get('/export', adminProtect, downloadVente);

/**
 * @swagger
 * /api/admin/ventes/{id}:
 *   get:
 *     summary: Récupérer une vente par son ID
 *     tags: [Ventes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Détails de la vente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vente'
 *       404:
 *         description: Vente non trouvée
 *   put:
 *     summary: Mettre à jour une vente
 *     tags: [Ventes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Vente mise à jour
 *   delete:
 *     summary: Supprimer une vente
 *     tags: [Ventes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Vente supprimée
 */
router.get('/:id', adminProtect, getVenteById);
router.post('/create', adminProtect, createVente);
router.put('/:id', adminProtect, updateVente);

/**
 * @swagger
 * /api/admin/ventes/{id}/status:
 *   patch:
 *     summary: Changer le statut d'une vente
 *     tags: [Ventes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [statut]
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [En attente, Confirmée, Payée, Annulée]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       400:
 *         description: Statut invalide
 */
router.patch('/:id/status', adminProtect, updateVenteStatus);
router.delete('/:id', adminProtect, deleteVente);

export default router;