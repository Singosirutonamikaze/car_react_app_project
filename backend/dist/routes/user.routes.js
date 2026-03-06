"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
/**
 * @swagger
 * /user/userData:
 *   get:
 *     summary: Récupérer les données complètes de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Données utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/userData', authMiddleware_1.userProtect, authController_1.getUserData);
/**
 * @swagger
 * /user/user/enhanced:
 *   get:
 *     summary: Récupérer les données enrichies (commandes, achats, favoris)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Données enrichies avec commandes, achats et favoris
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/user/enhanced', authMiddleware_1.userProtect, authController_1.getUserDataEnhanced);
/**
 * @swagger
 * /user/user/update-profile:
 *   put:
 *     summary: Mettre à jour le profil de l'utilisateur
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               telephone:
 *                 type: string
 *               adresse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put('/user/update-profile', authMiddleware_1.userProtect, authController_1.updateUserProfile);
/**
 * @swagger
 * /user/user:
 *   get:
 *     summary: Récupérer les données de l'utilisateur
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Données utilisateur
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/user', authMiddleware_1.userProtect, authController_1.getUserData);
/**
 * @swagger
 * /user/user/light:
 *   get:
 *     summary: Récupérer les données légères de l'utilisateur
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Données minimales de l'utilisateur
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/user/light', authMiddleware_1.userProtect, authController_1.getUserDataLight);
/**
 * @swagger
 * /user/user/paginated:
 *   get:
 *     summary: Récupérer les données paginées de l'utilisateur
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Données paginées
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/user/paginated', authMiddleware_1.userProtect, authController_1.getUserDataPaginated);
/**
 * @swagger
 * /user/user/compatible:
 *   get:
 *     summary: Récupérer les données compatibles (format unifié)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Données utilisateur (format compatible)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/user/compatible', authMiddleware_1.userProtect, authController_1.getUserDataCompatible);
/**
 * @swagger
 * /user/user/profile:
 *   get:
 *     summary: Récupérer le profil utilisateur
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/user/profile', authMiddleware_1.userProtect, authController_1.getUserDataLight);
exports.default = router;
