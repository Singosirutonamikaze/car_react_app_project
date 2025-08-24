import express, { NextFunction, Request, Response } from 'express';
import { 
    getAllCommande, 
    addCommande, 
    updateCommande, 
    deleteCommande, 
    downloadsCommande 
} from '../controllers/commandsController';
import {adminProtect, userProtect} from '../middleware/authMiddleware';
import { body, param } from 'express-validator';
import { validationResult } from 'express-validator';

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
    body('client').isMongoId().withMessage('ID client invalide'),
    body('voiture').isMongoId().withMessage('ID voiture invalide'),
    body('montant').isNumeric().withMessage('Montant doit être un nombre'),
    body('fraisLivraison').optional().isNumeric().withMessage('Frais de livraison doit être un nombre'),
    body('modePaiement').isIn(['Espèces', 'Virement', 'Chèque', 'Financement']).withMessage('Mode de paiement invalide'),
    body('adresseLivraison.rue').notEmpty().withMessage('Rue requise'),
    body('adresseLivraison.ville').notEmpty().withMessage('Ville requise'),
    body('adresseLivraison.codePostal').matches(/^\d{5}$/).withMessage('Code postal invalide')
];

// Routes
router.get('/getAll', userProtect, getAllCommande);
router.get('/admin/getAll', adminProtect, getAllCommande);

router.post('/add', 
    userProtect, 
    commandeValidation,
    handleValidationErrors,
    addCommande
);

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

router.delete('/delete/:id', 
    adminProtect, 
    [
        param('id').isMongoId().withMessage('ID commande invalide')
    ],
    handleValidationErrors,
    deleteCommande
);

router.get('/downloads', userProtect, downloadsCommande);

router.get('/admin/downloads', adminProtect, downloadsCommande);

export default router;