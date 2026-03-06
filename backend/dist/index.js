"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("./server"));
const initAdmin_1 = __importDefault(require("./scripts/initAdmin"));
const PORT = process.env.PORT || 5000;
mongoose_1.default.connection.once('open', async () => {
    console.log('Connecté à MongoDB');
    await (0, initAdmin_1.default)();
});
server_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
