"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/adminRoutes.ts
const express_1 = __importDefault(require("express"));
const adminControllers_1 = require("../controllers/adminControllers");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = express_1.default.Router();
// Routes d'authentification
/**
 * @swagger
 * /admin/auth/login:
 *   post:
 *     summary: Connexion administrateur
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/auth/login', adminControllers_1.login);
/**
 * @swagger
 * /admin/auth/profile:
 *   get:
 *     summary: Récupérer le profil admin
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'administrateur
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
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/auth/profile', adminMiddleware_1.adminAuth, adminControllers_1.getProfile);
/**
 * @swagger
 * /admin/auth/change-password:
 *   put:
 *     summary: Changer le mot de passe admin
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Mot de passe modifié avec succès
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.put('/auth/change-password', adminMiddleware_1.adminAuth, adminControllers_1.changePassword);
exports.default = router;
