"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const authController_1 = require("../controllers/authController");
const clientsController_1 = require("../controllers/clientsController");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/version/auth/register:
 *   post:
 *     summary: Créer un nouveau compte client
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Données invalides ou email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', authController_1.registerUser);
/**
 * @swagger
 * /api/version/auth/login:
 *   post:
 *     summary: Connexion client
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Email ou mot de passe incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', authController_1.loginUser);
/**
 * @swagger
 * /api/version/auth/getUser:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 */
router.get('/getUser', authMiddleware_1.userProtect, authController_1.getUserInfo);
/**
 * @swagger
 * /api/version/auth/updateUser:
 *   put:
 *     summary: Mettre à jour le profil utilisateur
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               surname: { type: string }
 *               email: { type: string, format: email }
 *               profileImage: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       401:
 *         description: Non authentifié
 */
router.put('/updateUser', authMiddleware_1.userProtect, clientsController_1.updateClient);
/**
 * @swagger
 * /api/version/auth/delete/myaccount/{id}:
 *   delete:
 *     summary: Supprimer son compte
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du compte à supprimer
 *     responses:
 *       200:
 *         description: Compte supprimé
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/delete/myaccount/:id', authMiddleware_1.userProtect, clientsController_1.deleteClient);
/**
 * @swagger
 * /api/version/auth/update/password:
 *   put:
 *     summary: Changer son mot de passe
 *     tags: [Auth]
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
 *               currentPassword: { type: string, format: password }
 *               newPassword: { type: string, format: password, minLength: 6 }
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour
 *       400:
 *         description: Mot de passe actuel incorrect
 */
router.put('/update/password', authMiddleware_1.userProtect, clientsController_1.updateClient);
/**
 * @swagger
 * /api/version/auth/forgot/password:
 *   post:
 *     summary: Demande de réinitialisation de mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email, example: 'jean@example.com' }
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 *       404:
 *         description: Aucun compte avec cet email
 */
router.post('/forgot/password', clientsController_1.updateClient);
exports.default = router;
