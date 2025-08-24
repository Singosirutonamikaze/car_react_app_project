// routes/carRoutes.ts
import express from 'express';
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  toggleCarAvailability,
  downloadCars
} from '../controllers/carsController';
import { adminProtect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/get', getAllCars);
router.get('/download', adminProtect, downloadCars);
router.get('/:id', getCarById);
router.post('/create', adminProtect, createCar);
router.put('/:id', adminProtect, updateCar);
router.delete('/:id', adminProtect, deleteCar);
router.patch('/:id/availability', adminProtect, toggleCarAvailability);

export default router;