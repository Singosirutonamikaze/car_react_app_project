"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getProfile = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        console.log('Tentative de connexion avec:', email);
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email et mot de passe requis'
            });
            return;
        }
        const admin = await Admin_1.default.findOne({ email });
        console.log('Admin trouvé:', admin ? admin.email : 'Aucun');
        if (!admin) {
            res.status(401).json({
                success: false,
                message: 'Identifiants invalides'
            });
            return;
        }
        if (!admin.isActive) {
            res.status(401).json({
                success: false,
                message: 'Compte administrateur désactivé'
            });
            return;
        }
        console.log('Mot de passe fourni:', password);
        console.log('Mot de passe stocké (haché):', admin.password);
        console.log('Comparaison des mots de passe...');
        const isPasswordValid = await bcryptjs_1.default.compare(password, admin.password);
        console.log('Résultat de la comparaison:', isPasswordValid);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Identifiants invalides'
            });
            return;
        }
        // Générer le token JWT
        const token = jsonwebtoken_1.default.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET || '', { expiresIn: '24h' });
        res.json({
            success: true,
            message: 'Connexion réussie',
            data: {
                token,
                user: {
                    id: admin._id,
                    email: admin.email,
                    isActive: admin.isActive
                }
            }
        });
    }
    catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        if (!req.admin) {
            res.status(401).json({ success: false, message: 'Non autorisé' });
            return;
        }
        const admin = await Admin_1.default.findById(req.admin.id).select('-password');
        if (!admin) {
            res.status(404).json({
                success: false,
                message: 'Admin non trouvé'
            });
            return;
        }
        res.json({
            success: true,
            data: admin
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getProfile = getProfile;
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!req.admin) {
            res.status(401).json({ success: false, message: 'Non autorisé' });
            return;
        }
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: 'Mot de passe actuel et nouveau mot de passe requis'
            });
            return;
        }
        const admin = await Admin_1.default.findById(req.admin.id);
        if (!admin) {
            res.status(404).json({
                success: false,
                message: 'Admin non trouvé'
            });
            return;
        }
        const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, admin.password);
        if (!isCurrentPasswordValid) {
            res.status(400).json({
                success: false,
                message: 'Mot de passe actuel incorrect'
            });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        admin.password = await bcryptjs_1.default.hash(newPassword, salt);
        await admin.save();
        res.json({
            success: true,
            message: 'Mot de passe changé avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.changePassword = changePassword;
