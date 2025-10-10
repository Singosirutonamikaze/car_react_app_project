"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commandsController_1 = require("../controllers/commandsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const router = express_1.default.Router();
// Middleware de validation
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_2.validationResult)(req);
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
router.get('/getAll', authMiddleware_1.userProtect, commandsController_1.getAllCommande);
router.get('/admin/getAll', authMiddleware_1.adminProtect, commandsController_1.getAllCommande);
router.post('/add', authMiddleware_1.userProtect, commandeValidation, handleValidationErrors, commandsController_1.addCommande);
router.put('/update/:id', authMiddleware_1.adminProtect, [
    (0, express_validator_1.param)('id').isMongoId().withMessage('ID commande invalide'),
    (0, express_validator_1.body)('statut').optional().isIn(['En attente', 'Confirmée', 'En cours', 'Livrée', 'Annulée']),
    (0, express_validator_1.body)('modePaiement').optional().isIn(['Espèces', 'Virement', 'Chèque', 'Financement'])
], handleValidationErrors, commandsController_1.updateCommande);
router.delete('/delete/:id', authMiddleware_1.adminProtect, [
    (0, express_validator_1.param)('id').isMongoId().withMessage('ID commande invalide')
], handleValidationErrors, commandsController_1.deleteCommande);
router.get('/downloads', authMiddleware_1.userProtect, commandsController_1.downloadsCommande);
router.get('/admin/downloads', authMiddleware_1.adminProtect, commandsController_1.downloadsCommande);
exports.default = router;
