"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ventesController_1 = require("../controllers/ventesController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Routes pour les ventes
router.get('/get', authMiddleware_1.adminProtect, ventesController_1.getAllVentes);
router.get('/stats', authMiddleware_1.adminProtect, ventesController_1.getVentesStats);
router.get('/export', authMiddleware_1.adminProtect, ventesController_1.downloadVente);
router.get('/:id', authMiddleware_1.adminProtect, ventesController_1.getVenteById);
router.post('/create', authMiddleware_1.adminProtect, ventesController_1.createVente);
router.put('/:id', authMiddleware_1.adminProtect, ventesController_1.updateVente);
router.patch('/:id/status', authMiddleware_1.adminProtect, ventesController_1.updateVenteStatus);
router.delete('/:id', authMiddleware_1.adminProtect, ventesController_1.deleteVente);
exports.default = router;
