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
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("./server"));
const initAdmin_1 = __importDefault(require("./scripts/initAdmin"));
const PORT = process.env.PORT || 5000;
mongoose_1.default.connection.once('open', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Connecté à MongoDB');
    yield (0, initAdmin_1.default)();
}));
server_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
