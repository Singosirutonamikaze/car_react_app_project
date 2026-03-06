import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  voiture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  duree: {
    type: Number,
    required: true,
    min: 1
  },
  prixParJour: {
    type: Number,
    required: true,
    min: 0
  },
  montantTotal: {
    type: Number,
    required: true,
    min: 0
  },
  statut: {
    type: String,
    required: true,
    enum: ['En attente', 'Confirmée', 'En cours', 'Terminée', 'Annulée'],
    default: 'En attente'
  },
  modePaiement: {
    type: String,
    required: true,
    enum: ['Espèces', 'Virement', 'Chèque', 'Mobile Money']
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

locationSchema.index({ client: 1 });
locationSchema.index({ voiture: 1 });
locationSchema.index({ statut: 1 });
locationSchema.index({ dateDebut: 1 });

const LocationModel = mongoose.model<any>('Location', locationSchema);
export default LocationModel;
