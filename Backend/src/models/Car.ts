import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  marque: {
    type: String,
    required: true,
    trim: true
  },
  modelCar: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1990,
    max: new Date().getFullYear() + 1
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  couleur: {
    type: String,
    required: true,
    enum: ['Noir', 'Blanc', 'Gris', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Autre']
  },
  kilometrage: {
    type: Number,
    required: true,
    min: 0
  },
  carburant: {
    type: String,
    required: true,
    enum: ['Essence', 'Diesel', 'Hybride', 'Électrique']
  },
  image: {
    type: String,
    default: null
  },
  disponible: {
    type: Boolean,
    default: true
  },
  ville: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Index pour les recherches courantes
carSchema.index({ disponible: 1 });
carSchema.index({ marque: 1, modelCar: 1 });
carSchema.index({ price: 1 });
carSchema.index({ ville: 1 });

// Méthode pour formater le prix
carSchema.methods.getFormattedPrice = function() {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'Frcfa'
  }).format(this.price);
};

// Méthode pour obtenir le nom complet de la voiture
carSchema.methods.getFullName = function() {
  return `${this.marque} ${this.modelCar} ${this.year}`;
};

// Utilisez 'any' pour éviter les problèmes de types complexes
const CarModel = mongoose.model<any>('Car', carSchema);
export default CarModel;