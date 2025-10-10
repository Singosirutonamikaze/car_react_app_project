"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
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
        const admin = yield Admin_1.default.findById(decoded.id).select('-password');
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
});
exports.adminAuth = adminAuth;
