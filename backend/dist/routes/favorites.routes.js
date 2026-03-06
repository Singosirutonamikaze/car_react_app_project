"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const favoritesControllers_1 = require("../controllers/favoritesControllers");
const router = express_1.default.Router();
/**
 * @swagger
 * /favorites/user/favorites:
 *   get:
 *     summary: Récupérer les favoris de l'utilisateur
 *     tags: [Favoris]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des favoris
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
 *                     $ref: '#/components/schemas/Car'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/user/favorites', authMiddleware_1.userProtect, favoritesControllers_1.getUserFavorites);
/**
 * @swagger
 * /favorites/user/favorites/liste:
 *   post:
 *     summary: Récupérer les favoris (méthode POST)
 *     tags: [Favoris]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des favoris
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/user/favorites/liste', authMiddleware_1.userProtect, favoritesControllers_1.getUserFavorites);
/**
 * @swagger
 * /favorites/user/favorites:
 *   post:
 *     summary: Ajouter une voiture aux favoris
 *     tags: [Favoris]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carId]
 *             properties:
 *               carId:
 *                 type: string
 *                 description: ID MongoDB de la voiture
 *     responses:
 *       201:
 *         description: Favori ajouté
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/user/favorites', authMiddleware_1.userProtect, favoritesControllers_1.addFavorite);
/**
 * @swagger
 * /favorites/user/favorites/{favoriteId}:
 *   delete:
 *     summary: Supprimer un favori
 *     tags: [Favoris]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: favoriteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du favori à supprimer
 *     responses:
 *       200:
 *         description: Favori supprimé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/user/favorites/:favoriteId', authMiddleware_1.userProtect, favoritesControllers_1.removeFavorite);
/**
 * @swagger
 * /favorites/user/favorites/toggle:
 *   put:
 *     summary: Basculer un favori (ajouter/supprimer)
 *     tags: [Favoris]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carId]
 *             properties:
 *               carId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Favori basculé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put('/user/favorites/toggle', authMiddleware_1.userProtect, favoritesControllers_1.toggleFavorite);
/**
 * @swagger
 * /favorites/user/favorites/toggle-simple:
 *   put:
 *     summary: Basculer un favori (version simple)
 *     tags: [Favoris]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carId]
 *             properties:
 *               carId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Favori basculé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put('/user/favorites/toggle-simple', authMiddleware_1.userProtect, favoritesControllers_1.toggleFavoriteSimple);
/**
 * @swagger
 * /favorites/user/favorites/toggle-clean:
 *   put:
 *     summary: Basculer un favori (version clean)
 *     tags: [Favoris]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carId]
 *             properties:
 *               carId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Favori basculé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put('/user/favorites/toggle-clean', authMiddleware_1.userProtect, favoritesControllers_1.toggleFavoriteClean);
exports.default = router;
