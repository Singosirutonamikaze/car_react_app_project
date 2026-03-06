// interfaces/ICar.ts
import { Types } from 'mongoose';

export interface ICar {
  _id?: Types.ObjectId;
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
  createdAt?: Date;
  updatedAt?: Date;
  getFormattedPrice?(): string;
  getFullName?(): string;
}