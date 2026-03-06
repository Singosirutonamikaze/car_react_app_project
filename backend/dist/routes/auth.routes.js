"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const authController_1 = require("../controllers/authController");
const clientsController_1 = require("../controllers/clientsController");
const router = express_1.default.Router();
// Route to register a new user
router.post('/register', authController_1.registerUser);
router.post('/login', authController_1.loginUser);
router.get('/getUser', authMiddleware_1.userProtect, authController_1.getUserInfo);
router.put('/updateUser', authMiddleware_1.userProtect, clientsController_1.updateClient);
router.delete('/delete/myaccount/:id', authMiddleware_1.userProtect, clientsController_1.deleteClient);
router.put('/update/password', authMiddleware_1.userProtect, clientsController_1.updateClient);
router.post('/forgot/password', clientsController_1.updateClient);
exports.default = router;
