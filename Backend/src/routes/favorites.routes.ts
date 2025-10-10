import express from 'express';
import { userProtect } from '../middleware/authMiddleware';
import { 
    getUserFavorites, 
    addFavorite,
    removeFavorite,
    toggleFavorite,
    toggleFavoriteSimple,
    toggleFavoriteClean
} from '../controllers/favoritesControllers';

const router = express.Router();

router.get('/user/favorites', userProtect, getUserFavorites);

router.post('/user/favorites/liste', userProtect, getUserFavorites);

router.post('/user/favorites', userProtect, addFavorite);

router.delete('/user/favorites/:favoriteId', userProtect, removeFavorite);

router.put('/user/favorites/toggle', userProtect, toggleFavorite);

router.put('/user/favorites/toggle-simple', userProtect, toggleFavoriteSimple);

router.put('/user/favorites/toggle-clean', userProtect, toggleFavoriteClean);

export default router;
