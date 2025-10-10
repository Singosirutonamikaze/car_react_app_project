import { Types } from "mongoose";
import { ICommande } from "./ICommande";
import { IFavorite } from "./IFavorite";
import { IAchat } from "./IAchat";

export interface IUserDocumentExtended extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  profileImageUrl?: string | null;
  commandes: Types.ObjectId[] | ICommande[];
  favorites: Types.ObjectId[] | IFavorite[];
  achats: Types.ObjectId[] | IAchat[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}