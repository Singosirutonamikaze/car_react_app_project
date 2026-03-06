
import { Schema } from 'mongoose';
import { IFavoriteDocument } from '../interfaces/IFavorite';
import { model } from 'mongoose';

const favoriteSchema = new Schema<IFavoriteDocument>({
  voiture: {
    type: Schema.Types.ObjectId,
    ref: 'Voiture',
    required: true
  },
  dateAjout: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

favoriteSchema.index({ voiture: 1 });
favoriteSchema.index({ dateAjout: -1 });


export const FavoriteModel = model<IFavoriteDocument>('Favorite', favoriteSchema);