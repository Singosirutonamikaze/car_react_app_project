"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ClientSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,
        default: null
    },
    commandes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Commande'
        }],
    favorites: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Favorite'
        }],
    achats: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Achat'
        }],
    locations: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Location'
        }],
}, { timestamps: true });
// Hash password before save
ClientSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    user.password = await bcryptjs_1.default.hash(user.password, salt);
    next();
});
// Compare password method
ClientSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
const UserModel = mongoose_1.default.model('Client', ClientSchema);
// Export with proper typing
exports.default = UserModel;
