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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadClientsPDF = exports.deleteClient = exports.updateClient = exports.createClient = exports.getClients = void 0;
const Client_1 = __importDefault(require("../models/Client"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const getClients = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = yield Client_1.default.find().select('-password');
        res.json(clients);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des clients :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});
exports.getClients = getClients;
const createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const newUser = new Client_1.default({
            name,
            surname,
            email,
            password,
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
exports.createClient = createClient;
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { _id } = _a, updates = __rest(_a, ["_id"]);
        console.log('Données reçues:', req.body);
        console.log('ID client:', _id);
        console.log('Updates:', updates);
        if (!_id) {
            res.status(400).json({
                message: 'ID du client requis'
            });
            return;
        }
        if (updates.password === '' || updates.password === undefined) {
            delete updates.password;
        }
        const client = yield Client_1.default.findByIdAndUpdate(_id, updates, { new: true, runValidators: true }).select('-password');
        if (!client) {
            res.status(404).json({
                message: 'Client introuvable'
            });
            return;
        }
        console.log('Client mis à jour:', client);
        res.json(client);
    }
    catch (error) {
        console.error("Erreur lors de la mise à jour du client :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});
exports.updateClient = updateClient;
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                message: 'ID du client requis'
            });
            return;
        }
        const client = yield Client_1.default.findByIdAndDelete(id);
        if (!client) {
            res.status(404).json({
                message: 'Client introuvable'
            });
            return;
        }
        res.json({ message: 'Client supprimé avec succès' });
    }
    catch (error) {
        console.error("Erreur lors de la suppression du client :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});
exports.deleteClient = deleteClient;
const downloadClientsPDF = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = yield Client_1.default.find().select('-password');
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=clients.pdf');
        doc.pipe(res);
        doc.fontSize(20).text('Liste des Clients', 50, 50);
        doc.moveDown(2);
        // Headers du tableau
        doc.fontSize(12);
        let yPosition = 120;
        doc.text('Nom', 50, yPosition);
        doc.text('Prénom', 150, yPosition);
        doc.text('Email', 250, yPosition);
        doc.text('Date création', 400, yPosition);
        // Ligne de séparation
        doc.moveTo(50, yPosition + 20).lineTo(550, yPosition + 20).stroke();
        yPosition += 30;
        clients.forEach((client, index) => {
            if (yPosition > 700) {
                doc.addPage();
                yPosition = 50;
            }
            doc.text(client.name || 'N/A', 50, yPosition);
            doc.text(client.surname || 'N/A', 150, yPosition);
            doc.text(client.email || 'N/A', 250, yPosition);
            doc.text(client.createdAt ? new Date(client.createdAt).toLocaleDateString('fr-FR') : 'N/A', 400, yPosition);
            yPosition += 25;
        });
        doc.fontSize(10).text(`Total: ${clients.length} clients`, 50, yPosition + 20);
        doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 50, yPosition + 35);
        doc.end();
    }
    catch (error) {
        console.error("Erreur lors de la génération du PDF :", error);
        res.status(500).json({ message: 'Erreur lors de la génération du PDF.' });
    }
});
exports.downloadClientsPDF = downloadClientsPDF;
