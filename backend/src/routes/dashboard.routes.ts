import express from 'express';
import { getDashboardData } from '../controllers/dashboardController';
import { adminProtect } from '../middleware/authMiddleware';
const router = express.Router();


/**
 * @swagger
 * /dashboard/:
 *   get:
 *     summary: Données globales du tableau de bord (admin)
 *     description: Retourne les statistiques agrégées — clients, voitures, commandes, ventes — et les alertes stock.
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Données du dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalClients:
 *                       type: number
 *                     totalVoitures:
 *                       type: number
 *                     totalCommandes:
 *                       type: number
 *                     totalVentes:
 *                       type: number
 *                     chiffreAffaires:
 *                       type: number
 *                     alertesStock:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/', adminProtect, getDashboardData);

export default router;