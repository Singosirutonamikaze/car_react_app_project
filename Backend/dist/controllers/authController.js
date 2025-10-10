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
exports.getUserInfo = exports.loginUser = exports.registerUser = void 0;
const Client_1 = __importDefault(require("../models/Client"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, surname, email, password } = req.body;
        if (!name || !surname || !email || !password) {
            res.status(400).json({ message: "S'il vous plaît, remplissez tous les champs." });
            return;
        }
        const existingUser = yield Client_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
            return;
        }
        const profileImageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.profileImageUrl || null);
        const newUser = new Client_1.default({
            name,
            surname,
            email,
            password,
            profileImageUrl,
        });
        yield newUser.save();
        const token = (0, generateToken_1.default)(newUser._id.toString());
        const userToReturn = newUser.toObject();
        delete userToReturn.password;
        res.status(201).json({ token, user: userToReturn });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 11000 && ((_a = error.keyPattern) === null || _a === void 0 ? void 0 : _a.email)) {
            res.status(400).json({ message: "L'email est déjà utilisé." });
            return;
        }
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Login request body:", req.body);
        const { email, password } = req.body || {};
        if (!email || !password) {
            res.status(400).json({ message: "S'il vous plaît, remplissez tous les champs." });
            return;
        }
        const user = yield Client_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        const isPasswordValid = yield user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Mot de passe incorrect.' });
            return;
        }
        const token = (0, generateToken_1.default)(user._id.toString());
        const userToReturn = user.toObject();
        delete userToReturn.password;
        res.status(200).json({ token, user: userToReturn });
    }
    catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});
exports.loginUser = loginUser;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("getUserInfo request user:", req.user);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Non autorisé.' });
            return;
        }
        const user = yield Client_1.default.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error("Erreur getUserInfo :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});
exports.getUserInfo = getUserInfo;
