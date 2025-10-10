"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/clients.routes.js
const express_1 = __importDefault(require("express"));
const clients_controller_1 = require("../controllers/clients.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/get', authMiddleware_1.adminProtect, clients_controller_1.getClients);
router.post('/create', authMiddleware_1.adminProtect, clients_controller_1.createClient);
router.put('/update/', authMiddleware_1.adminProtect, clients_controller_1.updateClient);
router.delete('/delete/:id', authMiddleware_1.adminProtect, clients_controller_1.deleteClient);
router.get('/download', authMiddleware_1.adminProtect, clients_controller_1.downloadClientsPDF);
exports.default = router;
