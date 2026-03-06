"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchatModel = void 0;
const mongoose_1 = require("mongoose");
const achatSchema = new mongoose_1.Schema({
    voiture: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Voiture',
        required: true
    },
    commande: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Commande',
        required: true
    },
    prixAchat: {
        type: Number,
        required: true,
        min: 0
    },
    statut: {
        type: String,
        enum: ['En attente', 'Confirmé', 'Payé', 'Livré', 'Terminé', 'Annulé'],
        default: 'En attente'
    },
    dateAchat: {
        type: Date,
        default: Date.now
    },
    datePaiement: {
        type: Date
    },
    dateLivraison: {
        type: Date
    },
    numeroTransaction: {
        type: String,
        unique: true,
        sparse: true
    },
    modePaiement: {
        type: String,
        enum: ['Espèces', 'Virement', 'Chèque', 'Financement'],
        required: true
    },
    notes: {
        type: String,
        maxlength: 1000
    },
    evaluation: {
        note: {
            type: Number,
            min: 1,
            max: 5
        },
        commentaire: {
            type: String,
            maxlength: 500
        },
        dateEvaluation: {
            type: Date
        }
    }
}, {
    timestamps: true
});
achatSchema.index({ voiture: 1 });
achatSchema.index({ commande: 1 });
achatSchema.index({ statut: 1 });
achatSchema.index({ dateAchat: -1 });
achatSchema.index({ numeroTransaction: 1 });
exports.AchatModel = (0, mongoose_1.model)('Achat', achatSchema);
