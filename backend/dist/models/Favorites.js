"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const favoriteSchema = new mongoose_1.Schema({
    voiture: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Voiture',
        required: true
    },
    dateAjout: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});
favoriteSchema.index({ voiture: 1 });
favoriteSchema.index({ dateAjout: -1 });
exports.FavoriteModel = (0, mongoose_2.model)('Favorite', favoriteSchema);
