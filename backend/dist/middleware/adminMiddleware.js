"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Token d\'authentification requis'
            });
            return;
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET non défini');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const admin = await Admin_1.default.findById(decoded.id).select('-password');
        if (!admin || !admin.isActive) {
            res.status(401).json({
                success: false,
                message: 'Admin non trouvé ou compte désactivé'
            });
            return;
        }
        req.admin = { id: admin._id.toString(), email: admin.email };
        next();
    }
    catch (error) {
        console.error('Erreur d\'authentification:', error);
        res.status(401).json({
            success: false,
            message: 'Token invalide'
        });
    }
};
exports.adminAuth = adminAuth;
