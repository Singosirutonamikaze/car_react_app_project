"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/carRoutes.ts
const express_1 = __importDefault(require("express"));
const carsController_1 = require("../controllers/carsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/admin/cars/get:
 *   get:
 *     summary: Lister toutes les voitures (avec filtres optionnels)
 *     tags: [Voitures]
 *     parameters:
 *       - in: query
 *         name: disponible
 *         schema: { type: boolean }
 *         description: Filtrer par disponibilité
 *       - in: query
 *         name: marque
 *         schema: { type: string }
 *         description: Filtrer par marque (recherche partielle)
 *       - in: query
 *         name: ville
 *         schema: { type: string }
 *         description: Filtrer par ville
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *         description: Prix minimum
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *         description: Prix maximum
 *     responses:
 *       200:
 *         description: Liste des voitures
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
 *                     $ref: '#/components/schemas/Car'
 */
router.get('/get', carsController_1.getAllCars);
/**
 * @swagger
 * /api/admin/cars/download:
 *   get:
 *     summary: Télécharger la liste des voitures en PDF
 *     tags: [Voitures]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Fichier PDF généré
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Non autorisé
 */
router.get('/download', authMiddleware_1.adminProtect, carsController_1.downloadCars);
/**
 * @swagger
 * /api/admin/cars/{id}:
 *   get:
 *     summary: Récupérer une voiture par son ID
 *     tags: [Voitures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Détails de la voiture
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Voiture non trouvée
 *   put:
 *     summary: Mettre à jour une voiture
 *     tags: [Voitures]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarInput'
 *     responses:
 *       200:
 *         description: Voiture mise à jour
 *       404:
 *         description: Voiture non trouvée
 *   delete:
 *     summary: Supprimer une voiture
 *     tags: [Voitures]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Voiture supprimée
 *       404:
 *         description: Voiture non trouvée
 *   patch:
 *     summary: Basculer la disponibilité d'une voiture
 *     tags: [Voitures]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Disponibilité mise à jour
 *       404:
 *         description: Voiture non trouvée
 */
router.get('/:id', carsController_1.getCarById);
/**
 * @swagger
 * /api/admin/cars/create:
 *   post:
 *     summary: Créer une nouvelle voiture
 *     tags: [Voitures]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarInput'
 *     responses:
 *       201:
 *         description: Voiture créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
router.post('/create', authMiddleware_1.adminProtect, carsController_1.createCar);
router.put('/:id', authMiddleware_1.adminProtect, carsController_1.updateCar);
router.delete('/:id', authMiddleware_1.adminProtect, carsController_1.deleteCar);
router.patch('/:id/availability', authMiddleware_1.adminProtect, carsController_1.toggleCarAvailability);
exports.default = router;
