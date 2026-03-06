"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const locationController_1 = require("../controllers/locationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/version/locations/get:
 *   get:
 *     summary: Lister toutes les locations (admin)
 *     tags: [Locations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Location'
 */
router.get('/get', authMiddleware_1.adminProtect, locationController_1.getAllLocations);
/**
 * @swagger
 * /api/version/locations/client/{clientId}:
 *   get:
 *     summary: Locations d'un client spécifique
 *     tags: [Locations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Locations du client
 *       404:
 *         description: Client non trouvé
 */
router.get('/client/:clientId', authMiddleware_1.userProtect, locationController_1.getLocationsByClient);
/**
 * @swagger
 * /api/version/locations/{id}:
 *   get:
 *     summary: Récupérer une location par son ID
 *     tags: [Locations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Détails de la location
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location non trouvée
 *   delete:
 *     summary: Supprimer une location
 *     tags: [Locations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Location supprimée
 */
router.get('/:id', authMiddleware_1.adminProtect, locationController_1.getLocationById);
/**
 * @swagger
 * /api/version/locations/create:
 *   post:
 *     summary: Créer une nouvelle location
 *     tags: [Locations]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [voiture, client, dateDebut, dateFin, prixParJour]
 *             properties:
 *               voiture: { type: string, description: ID de la voiture }
 *               client: { type: string, description: ID du client }
 *               dateDebut: { type: string, format: date-time }
 *               dateFin: { type: string, format: date-time }
 *               prixParJour: { type: number, example: 80 }
 *     responses:
 *       201:
 *         description: Location créée, durée et montant calculés automatiquement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Dates invalides ou voiture non disponible
 */
router.post('/create', authMiddleware_1.userProtect, locationController_1.createLocation);
/**
 * @swagger
 * /api/version/locations/{id}/statut:
 *   patch:
 *     summary: Mettre à jour le statut d'une location
 *     tags: [Locations]
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
 *                 enum: [En attente, Active, Terminée, Annulée]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/:id/statut', authMiddleware_1.adminProtect, locationController_1.updateLocationStatut);
router.delete('/:id', authMiddleware_1.adminProtect, locationController_1.deleteLocation);
exports.default = router;
