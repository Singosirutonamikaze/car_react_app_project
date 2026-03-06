"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commandsController_1 = require("../controllers/commandsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Middleware de validation
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Erreurs de validation',
            errors: errors.array()
        });
    }
    next();
};
// Validation pour la création de commande
const commandeValidation = [
    (0, express_validator_1.body)('client').isMongoId().withMessage('ID client invalide'),
    (0, express_validator_1.body)('voiture').isMongoId().withMessage('ID voiture invalide'),
    (0, express_validator_1.body)('montant').isNumeric().withMessage('Montant doit être un nombre'),
    (0, express_validator_1.body)('fraisLivraison').optional().isNumeric().withMessage('Frais de livraison doit être un nombre'),
    (0, express_validator_1.body)('modePaiement').isIn(['Espèces', 'Virement', 'Chèque', 'Financement']).withMessage('Mode de paiement invalide'),
    (0, express_validator_1.body)('adresseLivraison.rue').notEmpty().withMessage('Rue requise'),
    (0, express_validator_1.body)('adresseLivraison.ville').notEmpty().withMessage('Ville requise'),
    (0, express_validator_1.body)('adresseLivraison.codePostal').matches(/^\d{5}$/).withMessage('Code postal invalide')
];
// Routes
/**
 * @swagger
 * /commands/getAll:
 *   get:
 *     summary: Récupérer les commandes de l'utilisateur connecté
 *     tags: [Commandes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes
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
 *                     $ref: '#/components/schemas/Commande'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/getAll', authMiddleware_1.userProtect, commandsController_1.getAllCommande);
/**
 * @swagger
 * /commands/admin/getAll:
 *   get:
 *     summary: Récupérer toutes les commandes (admin)
 *     tags: [Commandes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste complète des commandes
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
 *                     $ref: '#/components/schemas/Commande'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/admin/getAll', authMiddleware_1.adminProtect, commandsController_1.getAllCommande);
/**
 * @swagger
 * /commands/add:
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Commandes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [client, voiture, montant, modePaiement, adresseLivraison]
 *             properties:
 *               client:
 *                 type: string
 *                 description: ID MongoDB du client
 *               voiture:
 *                 type: string
 *                 description: ID MongoDB de la voiture
 *               montant:
 *                 type: number
 *               fraisLivraison:
 *                 type: number
 *               modePaiement:
 *                 type: string
 *                 enum: [Espèces, Virement, Chèque, Financement]
 *               adresseLivraison:
 *                 type: object
 *                 required: [rue, ville, codePostal]
 *                 properties:
 *                   rue:
 *                     type: string
 *                   ville:
 *                     type: string
 *                   codePostal:
 *                     type: string
 *                     pattern: '^\d{5}$'
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commande'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/add', authMiddleware_1.userProtect, commandeValidation, handleValidationErrors, commandsController_1.addCommande);
/**
 * @swagger
 * /commands/update/{id}:
 *   put:
 *     summary: Mettre à jour le statut d'une commande (admin)
 *     tags: [Commandes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [En attente, Confirmée, En cours, Livrée, Annulée]
 *               modePaiement:
 *                 type: string
 *                 enum: [Espèces, Virement, Chèque, Financement]
 *     responses:
 *       200:
 *         description: Commande mise à jour
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/update/:id', authMiddleware_1.adminProtect, [
    (0, express_validator_1.param)('id').isMongoId().withMessage('ID commande invalide'),
    (0, express_validator_1.body)('statut').optional().isIn(['En attente', 'Confirmée', 'En cours', 'Livrée', 'Annulée']),
    (0, express_validator_1.body)('modePaiement').optional().isIn(['Espèces', 'Virement', 'Chèque', 'Financement'])
], handleValidationErrors, commandsController_1.updateCommande);
/**
 * @swagger
 * /commands/delete/{id}:
 *   delete:
 *     summary: Supprimer une commande (admin)
 *     tags: [Commandes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande à supprimer
 *     responses:
 *       200:
 *         description: Commande supprimée
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/delete/:id', authMiddleware_1.adminProtect, [
    (0, express_validator_1.param)('id').isMongoId().withMessage('ID commande invalide')
], handleValidationErrors, commandsController_1.deleteCommande);
/**
 * @swagger
 * /commands/downloads:
 *   get:
 *     summary: Télécharger les commandes en PDF (utilisateur)
 *     tags: [Commandes]
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
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/downloads', authMiddleware_1.userProtect, commandsController_1.downloadsCommande);
/**
 * @swagger
 * /commands/admin/downloads:
 *   get:
 *     summary: Télécharger toutes les commandes en PDF (admin)
 *     tags: [Commandes]
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
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/admin/downloads', authMiddleware_1.adminProtect, commandsController_1.downloadsCommande);
exports.default = router;
