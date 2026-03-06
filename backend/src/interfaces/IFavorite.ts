import { Document, Types } from 'mongoose';

export interface IFavorite {
    _id?: Types.ObjectId;
    voiture: Types.ObjectId;
    dateAjout: Date;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IPopulatedFavorite extends Omit<IFavorite, 'voiture'> {
    voiture: {
        _id: Types.ObjectId;
        marque: string;
        modele: string;
        annee: number;
        prix: number;
        images?: string[];
        disponible: boolean;
        kilometrage?: number;
        carburant?: string;
    };
}

export interface IFavoriteDocument extends Document, Omit<IFavorite, '_id'> { }
