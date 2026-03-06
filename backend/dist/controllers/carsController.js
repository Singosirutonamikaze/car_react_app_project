"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleCarAvailability = exports.deleteCar = exports.updateCar = exports.createCar = exports.getCarById = exports.getAllCars = void 0;
exports.downloadCars = downloadCars;
const Car_1 = __importDefault(require("../models/Car"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const getAllCars = async (req, res) => {
    try {
        const { disponible, marque, ville, minPrice, maxPrice } = req.query;
        let filter = {};
        if (disponible !== undefined)
            filter.disponible = disponible === 'true';
        if (marque)
            filter.marque = new RegExp(marque, 'i');
        if (ville)
            filter.ville = new RegExp(ville, 'i');
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.$gte = Number(minPrice);
            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
        }
        const cars = await Car_1.default.find(filter);
        res.status(200).json({
            success: true,
            data: cars,
            count: cars.length
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des voitures:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getAllCars = getAllCars;
const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car_1.default.findById(id);
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
    }
    catch (error) {
        console.error('Erreur lors de la récupération de la voiture:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.getCarById = getCarById;
const createCar = async (req, res) => {
    try {
        const carData = req.body;
        const newCar = new Car_1.default(carData);
        await newCar.save();
        res.status(201).json({
            success: true,
            message: 'Voiture créée avec succès',
            data: newCar
        });
    }
    catch (error) {
        console.error('Erreur lors de la création de la voiture:', error);
        if (error instanceof Error && error.name === 'ValidationError') {
            const validationError = error;
            const errors = Object.values(validationError.errors).map(err => ({
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
exports.createCar = createCar;
const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const car = await Car_1.default.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
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
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de la voiture:', error);
        if (error instanceof Error && error.name === 'ValidationError') {
            const validationError = error;
            const errors = Object.values(validationError.errors).map(err => ({
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
exports.updateCar = updateCar;
const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car_1.default.findByIdAndDelete(id);
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
    }
    catch (error) {
        console.error('Erreur lors de la suppression de la voiture:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.deleteCar = deleteCar;
const toggleCarAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car_1.default.findById(id);
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
    }
    catch (error) {
        console.error('Erreur lors du changement de disponibilité:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.toggleCarAvailability = toggleCarAvailability;
function downloadCars(req, res) {
    const doc = new pdfkit_1.default();
    const filename = `cars_${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);
    doc.fontSize(20).text('Liste des voitures', { align: 'center' });
    doc.moveDown();
    Car_1.default.find()
        .then(cars => {
        cars.forEach(car => {
            doc.fontSize(12).text(`Marque: ${car.marque}`);
            doc.fontSize(12).text(`Modèle: ${car.modelCar}`);
            doc.fontSize(12).text(`Année: ${car.year}`);
            doc.fontSize(12).text(`Prix: ${car.price}`);
            doc.moveDown();
        });
        doc.end();
    })
        .catch(error => {
        console.error('Erreur lors de la génération du PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    });
}
