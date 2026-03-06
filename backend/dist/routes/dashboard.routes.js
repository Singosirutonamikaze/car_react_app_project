"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controllers/dashboardController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
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
router.get('/', authMiddleware_1.adminProtect, dashboardController_1.getDashboardData);
exports.default = router;
