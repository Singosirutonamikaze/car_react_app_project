"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Solution radicale : utiliser any pour éviter les problèmes de typage
const adresseLivraisonSchema = new mongoose_1.default.Schema({
    rue: {
        type: String,
        required: true,
        trim: true
    },
    ville: {
        type: String,
        required: true,
        trim: true
    },
    codePostal: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{5}$/.test(v);
            },
            message: 'Code postal invalide'
        }
    },
    pays: {
        type: String,
        default: 'France',
        trim: true
    }
});
// Créer le schéma sans typage générique
const commandeSchema = new mongoose_1.default.Schema({
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
    statut: {
        type: String,
        required: true,
        enum: ['En attente', 'Confirmée', 'En cours', 'Livrée', 'Annulée'],
        default: 'En attente'
    },
    montant: {
        type: Number,
        required: true,
        min: 0
    },
    fraisLivraison: {
        type: Number,
        default: 0,
        min: 0
    },
    montantTotal: {
        type: Number,
        required: false,
        min: 0
    },
    modePaiement: {
        type: String,
        required: true,
        enum: ['Espèces', 'Virement', 'Chèque', 'Financement']
    },
    adresseLivraison: {
        type: adresseLivraisonSchema,
        required: true
    },
    dateCommande: {
        type: Date,
        default: Date.now
    },
    dateLivraisonPrevue: {
        type: Date
    },
    dateLivraisonReelle: {
        type: Date
    },
    notes: {
        type: String,
        maxlength: 1000
    }
}, {
    timestamps: true
});
// Index pour les recherches
commandeSchema.index({ client: 1 });
commandeSchema.index({ statut: 1 });
commandeSchema.index({ dateCommande: -1 });
// Middleware pour calculer le montant total avant sauvegarde
commandeSchema.pre('save', function (next) {
    if (this.isModified('montant') || this.isModified('fraisLivraison')) {
        this.montantTotal = this.montant + (this.fraisLivraison || 0);
    }
    next();
});
// Middleware pour calculer le montant total avant mise à jour
commandeSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update && (update.montant !== undefined || update.fraisLivraison !== undefined)) {
        if (!update.$set)
            update.$set = {};
        update.$set.montantTotal = (update.montant || this.get('montant')) + (update.fraisLivraison || this.get('fraisLivraison') || 0);
    }
    next();
});
// Exporter avec any pour éviter les problèmes de typage
const CommandeModel = mongoose_1.default.model('Commande', commandeSchema);
exports.default = CommandeModel;
