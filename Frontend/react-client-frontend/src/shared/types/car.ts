export interface Car {
    _id?: string;
    marque: string;
    modelCar: string;
    year: number;
    description: string;
    price: number;
    couleur: string;
    kilometrage: number;
    carburant: string;
    image?: string;
    disponible: boolean;
    ville: string;
}