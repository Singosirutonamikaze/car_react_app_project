"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/carRoutes.ts
const express_1 = __importDefault(require("express"));
const carsController_1 = require("../controllers/carsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/get', carsController_1.getAllCars);
router.get('/download', authMiddleware_1.adminProtect, carsController_1.downloadCars);
router.get('/:id', carsController_1.getCarById);
router.post('/create', authMiddleware_1.adminProtect, carsController_1.createCar);
router.put('/:id', authMiddleware_1.adminProtect, carsController_1.updateCar);
router.delete('/:id', authMiddleware_1.adminProtect, carsController_1.deleteCar);
router.patch('/:id/availability', authMiddleware_1.adminProtect, carsController_1.toggleCarAvailability);
exports.default = router;
