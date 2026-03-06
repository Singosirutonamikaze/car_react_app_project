"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.get('/userData', authMiddleware_1.userProtect, authController_1.getUserData);
router.get('/user/enhanced', authMiddleware_1.userProtect, authController_1.getUserDataEnhanced);
router.put('/user/update-profile', authMiddleware_1.userProtect, authController_1.updateUserProfile);
router.get('/user', authMiddleware_1.userProtect, authController_1.getUserData);
router.get('/user/light', authMiddleware_1.userProtect, authController_1.getUserDataLight);
router.get('/user/paginated', authMiddleware_1.userProtect, authController_1.getUserDataPaginated);
router.get('/user/compatible', authMiddleware_1.userProtect, authController_1.getUserDataCompatible);
router.get('/user/profile', authMiddleware_1.userProtect, authController_1.getUserDataLight);
exports.default = router;
