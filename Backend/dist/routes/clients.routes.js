"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/clients.routes.js
const express_1 = __importDefault(require("express"));
const clientsController_1 = require("../controllers/clientsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/get', authMiddleware_1.adminProtect, clientsController_1.getClients);
router.post('/create', authMiddleware_1.adminProtect, clientsController_1.createClient);
router.put('/update/', authMiddleware_1.adminProtect, clientsController_1.updateClient);
router.delete('/delete/:id', authMiddleware_1.adminProtect, clientsController_1.deleteClient);
router.get('/download', authMiddleware_1.adminProtect, clientsController_1.downloadClientsPDF);
exports.default = router;
