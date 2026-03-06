"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ventesController_1 = require("../controllers/ventesController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
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
router.get('/get', authMiddleware_1.adminProtect, ventesController_1.getAllVentes);
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
router.get('/stats', authMiddleware_1.adminProtect, ventesController_1.getVentesStats);
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
router.get('/export', authMiddleware_1.adminProtect, ventesController_1.downloadVente);
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
router.get('/:id', authMiddleware_1.adminProtect, ventesController_1.getVenteById);
router.post('/create', authMiddleware_1.adminProtect, ventesController_1.createVente);
router.put('/:id', authMiddleware_1.adminProtect, ventesController_1.updateVente);
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
router.patch('/:id/status', authMiddleware_1.adminProtect, ventesController_1.updateVenteStatus);
router.delete('/:id', authMiddleware_1.adminProtect, ventesController_1.deleteVente);
exports.default = router;
