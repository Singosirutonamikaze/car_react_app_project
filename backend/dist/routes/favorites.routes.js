"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const favoritesControllers_1 = require("../controllers/favoritesControllers");
const router = express_1.default.Router();
router.get('/user/favorites', authMiddleware_1.userProtect, favoritesControllers_1.getUserFavorites);
router.post('/user/favorites/liste', authMiddleware_1.userProtect, favoritesControllers_1.getUserFavorites);
router.post('/user/favorites', authMiddleware_1.userProtect, favoritesControllers_1.addFavorite);
router.delete('/user/favorites/:favoriteId', authMiddleware_1.userProtect, favoritesControllers_1.removeFavorite);
router.put('/user/favorites/toggle', authMiddleware_1.userProtect, favoritesControllers_1.toggleFavorite);
router.put('/user/favorites/toggle-simple', authMiddleware_1.userProtect, favoritesControllers_1.toggleFavoriteSimple);
router.put('/user/favorites/toggle-clean', authMiddleware_1.userProtect, favoritesControllers_1.toggleFavoriteClean);
exports.default = router;
