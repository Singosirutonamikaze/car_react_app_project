"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const locationController_1 = require("../controllers/locationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Routes admin
router.get('/get', authMiddleware_1.adminProtect, locationController_1.getAllLocations);
router.get('/:id', authMiddleware_1.adminProtect, locationController_1.getLocationById);
router.post('/create', authMiddleware_1.userProtect, locationController_1.createLocation);
router.patch('/:id/statut', authMiddleware_1.adminProtect, locationController_1.updateLocationStatut);
router.delete('/:id', authMiddleware_1.adminProtect, locationController_1.deleteLocation);
// Locations d'un client (accessible par le client lui-même ou l'admin)
router.get('/client/:clientId', authMiddleware_1.userProtect, locationController_1.getLocationsByClient);
exports.default = router;
