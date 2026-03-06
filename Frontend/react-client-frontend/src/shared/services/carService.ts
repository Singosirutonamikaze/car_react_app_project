import type { Car } from "../types/car";
import { API_CONFIG, API_PATHS } from "../utils/constants";

export const carService = {
    async getAllCars(): Promise<Car[]> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.CARS.GET_ALL}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la récupération des voitures');
            }

            const result = await response.json();

            if (result.success && result.data) {
                return result.data;
            }

            return result;
        } catch (error) {
            console.error('Erreur dans carService.getAllCars:', error);
            throw error;
        }
    },

    async getCarById(carId: string): Promise<Car> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_PATHS.CARS.GET_BY_ID(carId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la récupération de la voiture');
            }

            const result = await response.json();

            if (result.success && result.data) {
                return result.data;
            }

            return result;
        } catch (error) {
            console.error('Erreur dans carService.getCarById:', error);
            throw error;
        }
    }
};