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
exports.downloadsCommande = exports.deleteCommande = exports.updateCommande = exports.addCommande = exports.getAllCommande = void 0;
const Commande_1 = __importDefault(require("../models/Commande"));
const getAllCommande = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commandes = yield Commande_1.default.find()
            .populate('client', 'name surname email')
            .populate('voiture', 'marque model year price');
        res.status(200).json({
            success: true,
            data: commandes,
            count: commandes.length
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});
exports.getAllCommande = getAllCommande;
const addCommande = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { client, voiture, statut, montant, fraisLivraison, modePaiement, adresseLivraison, dateLivraisonPrevue, notes } = req.body;
        // Validation des données requises
        if (!client || !voiture || !montant || !modePaiement || !adresseLivraison) {
            res.status(400).json({
                success: false,
                message: 'Tous les champs obligatoires doivent être remplis'
            });
            return;
        }
        const nouvelleCommande = new Commande_1.default({
            client,
            voiture,
            statut: statut || 'En attente',
            montant,
            fraisLivraison: fraisLivraison || 0,
            modePaiement,
            adresseLivraison,
            dateLivraisonPrevue,
            notes
        });
        yield nouvelleCommande.save();
        // Populer les références pour la réponse
        const commandePopulee = yield Commande_1.default.findById(nouvelleCommande._id)
            .populate('client', 'name surname email')
            .populate('voiture', 'marque model year price');
        res.status(201).json({
            success: true,
            message: 'Commande créée avec succès',
            data: commandePopulee
        });
    }
    catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});
exports.addCommande = addCommande;
const updateCommande = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'ID de la commande requis'
            });
            return;
        }
        // Ne pas permettre la modification du montantTotal directement
        if (updates.montantTotal) {
            delete updates.montantTotal;
        }
        const commande = yield Commande_1.default.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('client', 'name surname email')
            .populate('voiture', 'marque model year price');
        if (!commande) {
            res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Commande mise à jour avec succès',
            data: commande
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de la commande:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});
exports.updateCommande = updateCommande;
const deleteCommande = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'ID de la commande requis'
            });
            return;
        }
        const commande = yield Commande_1.default.findByIdAndDelete(id);
        if (!commande) {
            res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Commande supprimée avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de la commande:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});
exports.deleteCommande = deleteCommande;
const downloadsCommande = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commandes = yield Commande_1.default.find()
            .populate('client', 'name surname email')
            .populate('voiture', 'marque model year price');
        // Formater les données pour l'export
        const dataForExport = commandes.map(commande => {
            var _a, _b, _c;
            let clientName = '';
            let clientEmail = '';
            if (commande.client && typeof commande.client === 'object' && 'name' in commande.client && 'surname' in commande.client && 'email' in commande.client) {
                clientName = `${commande.client.name} ${commande.client.surname}`;
                clientEmail = commande.client.email;
            }
            else {
                clientName = ((_a = commande.client) === null || _a === void 0 ? void 0 : _a.toString()) || '';
                clientEmail = '';
            }
            let voitureInfo = '';
            let voiturePrice = '';
            if (commande.voiture && typeof commande.voiture === 'object' && 'marque' in commande.voiture && 'model' in commande.voiture && 'year' in commande.voiture && 'price' in commande.voiture) {
                voitureInfo = `${commande.voiture.marque} ${commande.voiture.model} (${commande.voiture.year})`;
                voiturePrice = commande.voiture.price;
            }
            else {
                voitureInfo = ((_b = commande.voiture) === null || _b === void 0 ? void 0 : _b.toString()) || '';
                voiturePrice = '';
            }
            return {
                'Numéro Commande': commande._id,
                'Client': clientName,
                'Email Client': clientEmail,
                'Voiture': voitureInfo,
                'Prix Voiture': voiturePrice,
                'Statut': commande.statut,
                'Montant': commande.montant,
                'Frais Livraison': commande.fraisLivraison,
                'Montant Total': commande.montantTotal,
                'Mode Paiement': commande.modePaiement,
                'Date Commande': commande.dateCommande,
                'Date Livraison Prévue': commande.dateLivraisonPrevue,
                'Ville Livraison': ((_c = commande.adresseLivraison) === null || _c === void 0 ? void 0 : _c.ville) || ''
            };
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=commandes.csv');
        let csv = 'Numéro Commande,Client,Email Client,Voiture,Prix Voiture,Statut,Montant,Frais Livraison,Montant Total,Mode Paiement,Date Commande,Date Livraison Prévue,Ville Livraison\n';
        dataForExport.forEach(row => {
            csv += `"${Object.values(row).join('","')}"\n`;
        });
        res.status(200).send(csv);
    }
    catch (error) {
        console.error('Erreur lors de l\'export des commandes:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'export des commandes'
        });
    }
});
exports.downloadsCommande = downloadsCommande;
