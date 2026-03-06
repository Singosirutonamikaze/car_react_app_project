"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const achatControllers_1 = require("../controllers/achatControllers");
const router = express_1.default.Router();
// Achats
router.get('/user/achats', authMiddleware_1.userProtect, achatControllers_1.getUserAchats);
router.post('/user/achats', authMiddleware_1.userProtect, achatControllers_1.createAchat);
router.put('/user/achats/:id/status', authMiddleware_1.userProtect, achatControllers_1.updateAchatStatus);
router.post('/user/achats/:id/evaluation', authMiddleware_1.userProtect, achatControllers_1.addEvaluationAchat);
exports.default = router;
