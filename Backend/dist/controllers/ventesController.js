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
exports.downloadVente = exports.getVentesStats = exports.updateVenteStatus = exports.deleteVente = exports.updateVente = exports.createVente = exports.getVenteById = exports.getAllVentes = void 0;
const Vente_1 = __importDefault(require("../models/Vente"));
const Commande_1 = __importDefault(require("../models/Commande"));
const Car_1 = __importDefault(require("../models/Car"));
const getAllVentes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { statut, startDate, endDate } = req.query;
        let filter = {};
        if (statut)
            filter.statut = statut;
        if (startDate || endDate) {
            filter.dateVente = {};
            if (startDate)
                filter.dateVente.$gte = new Date(startDate);
            if (endDate)
                filter.dateVente.$lte = new Date(endDate);
        }
        const ventes = yield Vente_1.default.find(filter)
            .populate('voiture', 'marque model year')
            .populate('client', 'name surname email')
            .populate('commande', 'statut montantTotal');
        res.status(200).json({
            success: true,
            data: ventes,
            count: ventes.length
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des ventes:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});
exports.getAllVentes = getAllVentes;
const getVenteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const vente = yield Vente_1.default.findById(id)
            .populate('voiture')
            .populate('client')
            .populate('commande');
        if (!vente) {
            res.status(404).json({
                success: false,
                message: 'Vente non trouvée'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: vente
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération de la vente:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});
exports.getVenteById = getVenteById;
const createVente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const venteData = req.body;
        // Vérifier que la commande existe
        const commande = yield Commande_1.default.findById(venteData.commande);
        if (!commande) {
            res.status(404).json({
                success: false,
                message: 'Commande non trouvée'
            });
            return;
        }
        // Vérifier que la voiture existe
        const voiture = yield Car_1.default.findById(venteData.voiture);
        if (!voiture) {
            res.status(404).json({
                success: false,
                message: 'Voiture non trouvée'
            });
            return;
        }
        const newVente = new Vente_1.default(venteData);
        yield newVente.save();
        // Populer les références pour la réponse
        const ventePopulee = yield Vente_1.default.findById(newVente._id)
            .populate('voiture')
            .populate('client')
            .populate('commande');
        res.status(201).json({
            success: true,
            message: 'Vente créée avec succès',
            data: ventePopulee
        });
    }
    catch (error) {
        console.error('Erreur lors de la création de la vente:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => ({
                field: err.path,
                message: err.message
            }));
            res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});
exports.createVente = createVente;
const updateVente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const vente = yield Vente_1.default.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
            .populate('voiture')
            .populate('client')
            .populate('commande');
        if (!vente) {
            res.status(404).json({
                success: false,
                message: 'Vente non trouvée'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Vente mise à jour avec succès',
            data: vente
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de la vente:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => ({
                field: err.path,
                message: err.message
            }));
            res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});
exports.updateVente = updateVente;
const deleteVente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const vente = yield Vente_1.default.findByIdAndDelete(id);
        if (!vente) {
            res.status(404).json({
                success: false,
                message: 'Vente non trouvée'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Vente supprimée avec succès'
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de la vente:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});
exports.deleteVente = deleteVente;
const updateVenteStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { statut } = req.body;
        if (!['En attente', 'Confirmée', 'Payée', 'Annulée'].includes(statut)) {
            res.status(400).json({
                success: false,
                message: 'Statut invalide'
            });
            return;
        }
        const vente = yield Vente_1.default.findByIdAndUpdate(id, { statut }, { new: true })
            .populate('voiture')
            .populate('client')
            .populate('commande');
        if (!vente) {
            res.status(404).json({
                success: false,
                message: 'Vente non trouvée'
            });
            return;
        }
        // Si la vente est payée, mettre à jour la date de paiement
        if (statut === 'Payée') {
            vente.datePaiement = new Date();
            yield vente.save();
        }
        res.status(200).json({
            success: true,
            message: 'Statut de la vente mis à jour',
            data: vente
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});
exports.updateVenteStatus = updateVenteStatus;
const getVentesStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const stats = yield Vente_1.default.aggregate([
            {
                $group: {
                    _id: '$statut',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$prixVente' }
                }
            }
        ]);
        const totalVentes = yield Vente_1.default.countDocuments();
        const totalRevenue = yield Vente_1.default.aggregate([
            { $match: { statut: 'Payée' } },
            { $group: { _id: null, total: { $sum: '$prixVente' } } }
        ]);
        res.status(200).json({
            success: true,
            data: {
                statsByStatus: stats,
                totalVentes,
                totalRevenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0
            }
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
});
exports.getVentesStats = getVentesStats;
const downloadVente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Implémentation de l'export des ventes
    try {
        const ventes = yield Vente_1.default.find()
            .populate('voiture', 'marque model year price')
            .populate('client', 'name surname email')
            .populate('commande', 'statut montantTotal');
        const dataForExport = ventes.map(vente => {
            var _a, _b;
            return ({
                'Numéro Vente': vente._id,
                'Client': vente.client ? `${vente.client.name} ${vente.client.surname}` : '',
                'Email Client': ((_a = vente.client) === null || _a === void 0 ? void 0 : _a.email) || '',
                'Voiture': vente.voiture ? `${vente.voiture.marque} ${vente.voiture.model} (${vente.voiture.year})` : '',
                'Prix de Vente': vente.prixVente,
                'Statut': vente.statut,
                'Date Vente': vente.dateVente,
                'Date Paiement': vente.datePaiement || '',
                'Numéro Transaction': vente.numeroTransaction || '',
                'Commande Associée': ((_b = vente.commande) === null || _b === void 0 ? void 0 : _b._id) || ''
            });
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=ventes.csv');
        let csv = 'Numéro Vente,Client,Email Client,Voiture,Prix de Vente,Statut,Date Vente,Date Paiement,Numéro Transaction,Commande Associée\n';
        dataForExport.forEach(row => {
            csv += `"${Object.values(row).join('","')}"\n`;
        });
        res.status(200).send(csv);
    }
    catch (error) {
        console.error('Erreur lors de l\'export des ventes:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'export des ventes'
        });
    }
});
exports.downloadVente = downloadVente;
