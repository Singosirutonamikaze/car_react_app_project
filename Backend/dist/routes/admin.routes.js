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
router.post('/auth/login', adminControllers_1.login);
router.get('/auth/profile', adminMiddleware_1.adminAuth, adminControllers_1.getProfile);
router.put('/auth/change-password', adminMiddleware_1.adminAuth, adminControllers_1.changePassword);
exports.default = router;
