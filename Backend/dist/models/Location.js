"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const locationSchema = new mongoose_1.default.Schema({
    client: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    voiture: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    dateDebut: {
        type: Date,
        required: true
    },
    dateFin: {
        type: Date,
        required: true
    },
    duree: {
        type: Number,
        required: true,
        min: 1
    },
    prixParJour: {
        type: Number,
        required: true,
        min: 0
    },
    montantTotal: {
        type: Number,
        required: true,
        min: 0
    },
    statut: {
        type: String,
        required: true,
        enum: ['En attente', 'Confirmée', 'En cours', 'Terminée', 'Annulée'],
        default: 'En attente'
    },
    modePaiement: {
        type: String,
        required: true,
        enum: ['Espèces', 'Virement', 'Chèque', 'Mobile Money']
    },
    notes: {
        type: String,
        maxlength: 1000
    }
}, {
    timestamps: true
});
locationSchema.index({ client: 1 });
locationSchema.index({ voiture: 1 });
locationSchema.index({ statut: 1 });
locationSchema.index({ dateDebut: 1 });
const LocationModel = mongoose_1.default.model('Location', locationSchema);
exports.default = LocationModel;
