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
const Admin_1 = __importDefault(require("../models/Admin"));
const createDefaultAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminCount = yield Admin_1.default.countDocuments();
        if (adminCount === 0) {
            const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
            const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
            console.log('Création de l\'admin par défaut avec le mot de passe:', defaultPassword);
            const newAdmin = new Admin_1.default({
                email: defaultEmail,
                password: defaultPassword,
                isActive: true
            });
            yield newAdmin.save();
            console.log('Admin par défaut créé avec succès');
            console.log('Email:', defaultEmail);
            console.log('Mot de passe (en clair):', defaultPassword);
            const savedAdmin = yield Admin_1.default.findOne({ email: defaultEmail });
            console.log('Mot de passe haché en base:', savedAdmin === null || savedAdmin === void 0 ? void 0 : savedAdmin.password);
        }
        else {
            console.log('Admin(s) déjà existant(s) dans la base de données');
        }
    }
    catch (error) {
        console.error('Erreur lors de la création de l\'admin par défaut:', error);
    }
});
exports.default = createDefaultAdmin;
