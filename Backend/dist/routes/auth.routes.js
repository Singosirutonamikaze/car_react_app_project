"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Route to register a new user
router.post('/register', authController_1.registerUser);
// Route to login a user
router.post('/api/version/admin/auth/login', authController_1.loginUser);
router.post('/login', authController_1.loginUser);
router.get('/getUser', authMiddleware_1.userProtect, authController_1.getUserInfo);
exports.default = router;
