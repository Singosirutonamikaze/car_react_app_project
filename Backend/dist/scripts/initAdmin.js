"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/initAdmin.ts
const Admin_1 = __importDefault(require("../models/Admin"));
const createDefaultAdmin = async () => {
    try {
        const adminCount = await Admin_1.default.countDocuments();
        if (adminCount === 0) {
            const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
            const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
            console.log('Création de l\'admin par défaut...');
            const newAdmin = new Admin_1.default({
                email: defaultEmail,
                password: defaultPassword,
                isActive: true
            });
            await newAdmin.save();
            console.log('Admin par défaut créé avec succès');
            console.log('Email:', defaultEmail);
        }
        else {
            console.log('Admin(s) déjà existant(s) dans la base de données');
        }
    }
    catch (error) {
        console.error('Erreur lors de la création de l\'admin par défaut:', error);
    }
};
exports.default = createDefaultAdmin;
