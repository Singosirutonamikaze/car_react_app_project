import express, { NextFunction, Request, Response } from 'express';
import {
    getAllCommande,
    addCommande,
    updateCommande,
    deleteCommande,
    downloadsCommande
} from '../controllers/commandsController';
import { adminProtect, userProtect, userOrAdminProtect } from '../middleware/authMiddleware';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

// Middleware de validation
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
    body('client').optional().isMongoId().withMessage('ID client invalide'),
    body('voiture').isMongoId().withMessage('ID voiture invalide'),
    body('montant').isNumeric().withMessage('Montant doit être un nombre'),
    body('fraisLivraison').optional().isNumeric().withMessage('Frais de livraison doit être un nombre'),
    body('modePaiement').isIn(['Espèces', 'Virement', 'Chèque', 'Financement']).withMessage('Mode de paiement invalide'),
    body('adresseLivraison.rue').notEmpty().withMessage('Rue requise'),
    body('adresseLivraison.ville').notEmpty().withMessage('Ville requise'),
    body('adresseLivraison.codePostal').matches(/^\d{5}$/).withMessage('Code postal invalide')
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
router.get('/getAll', userProtect, getAllCommande);
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
router.get('/admin/getAll', adminProtect, getAllCommande);

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

router.post('/add',
    userOrAdminProtect,
    commandeValidation,
    handleValidationErrors,
    addCommande
);

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
router.put('/update/:id',
    adminProtect,
    [
        param('id').isMongoId().withMessage('ID commande invalide'),
        body('statut').optional().isIn(['En attente', 'Confirmée', 'En cours', 'Livrée', 'Annulée']),
        body('modePaiement').optional().isIn(['Espèces', 'Virement', 'Chèque', 'Financement'])
    ],
    handleValidationErrors,
    updateCommande
);

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
router.delete('/delete/:id',
    adminProtect,
    [
        param('id').isMongoId().withMessage('ID commande invalide')
    ],
    handleValidationErrors,
    deleteCommande
);

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
router.get('/downloads', userProtect, downloadsCommande);

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
router.get('/admin/downloads', adminProtect, downloadsCommande);

export default router;