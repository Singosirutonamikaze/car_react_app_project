import express from 'express';
import { adminProtect, userProtect } from '../middleware/authMiddleware';
import {
  addEvaluationAchat,
  createAchat,
  getAdminAchatsChartsByDate,
  getAllAchatsAdmin,
  getUserAchats,
  getUserAchatsChartsByDate,
  updateAchatStatusAdmin,
  updateAchatStatus
} from '../controllers/achatControllers'

const router = express.Router();

// Achats
/**
 * @swagger
 * /achats/user/achats:
 *   get:
 *     summary: Récupérer les achats de l'utilisateur connecté
 *     tags: [Achats]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des achats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/user/achats', userProtect, getUserAchats);
router.get('/user/achats/charts', userProtect, getUserAchatsChartsByDate);
router.get('/admin/achats', adminProtect, getAllAchatsAdmin);
router.get('/admin/achats/charts', adminProtect, getAdminAchatsChartsByDate);
router.put('/admin/achats/:id/status', adminProtect, updateAchatStatusAdmin);

/**
 * @swagger
 * /achats/user/achats:
 *   post:
 *     summary: Créer un achat
 *     tags: [Achats]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [voitureId, montant, modePaiement]
 *             properties:
 *               voitureId:
 *                 type: string
 *                 description: ID MongoDB de la voiture
 *               montant:
 *                 type: number
 *               modePaiement:
 *                 type: string
 *                 enum: [Espèces, Virement, Chèque, Financement]
 *     responses:
 *       201:
 *         description: Achat créé
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/user/achats', userProtect, createAchat);

/**
 * @swagger
 * /achats/user/achats/{id}/status:
 *   put:
 *     summary: Mettre à jour le statut d'un achat
 *     tags: [Achats]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'achat
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
 *                 enum: [En attente, Confirmé, Annulé]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/user/achats/:id/status', userProtect, updateAchatStatus);

/**
 * @swagger
 * /achats/user/achats/{id}/evaluation:
 *   post:
 *     summary: Ajouter une évaluation à un achat
 *     tags: [Achats]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'achat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [note]
 *             properties:
 *               note:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               commentaire:
 *                 type: string
 *     responses:
 *       200:
 *         description: Évaluation ajoutée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/user/achats/:id/evaluation', userProtect, addEvaluationAchat);

export default router;
