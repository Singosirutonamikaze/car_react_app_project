import { Request, Response } from 'express';
import CarModel from '../models/Car';

export const getAllCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const { disponible, marque, ville, minPrice, maxPrice } = req.query;
    
    let filter: any = {};
    
    if (disponible !== undefined) filter.disponible = disponible === 'true';
    if (marque) filter.marque = new RegExp(marque as string, 'i');
    if (ville) filter.ville = new RegExp(ville as string, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const cars = await CarModel.find(filter);
    
    res.status(200).json({
      success: true,
      data: cars,
      count: cars.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des voitures:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const getCarById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const car = await CarModel.findById(id);
    
    if (!car) {
      res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const createCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const carData = req.body;
    
    const newCar = new CarModel(carData);
    await newCar.save();
    
    res.status(201).json({
      success: true,
      message: 'Voiture créée avec succès',
      data: newCar
    });
  } catch (error: any) {
    console.error('Erreur lors de la création de la voiture:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }));
      
      res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const updateCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const car = await CarModel.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!car) {
      res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Voiture mise à jour avec succès',
      data: car
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la voiture:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }));
      
      res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const deleteCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const car = await CarModel.findByIdAndDelete(id);
    
    if (!car) {
      res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Voiture supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la voiture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const toggleCarAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const car = await CarModel.findById(id);
    
    if (!car) {
      res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
      return;
    }
    
    car.disponible = !car.disponible;
    await car.save();
    
    res.status(200).json({
      success: true,
      message: `Voiture ${car.disponible ? 'disponible' : 'indisponible'}`,
      data: car
    });
  } catch (error) {
    console.error('Erreur lors du changement de disponibilité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};