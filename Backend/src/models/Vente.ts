import mongoose from 'mongoose';

const venteSchema = new mongoose.Schema({
  voiture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  commande: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commande',
    required: true
  },
  prixVente: {
    type: Number,
    required: true,
    min: 0
  },
  statut: {
    type: String,
    required: true,
    enum: ['En attente', 'Confirmée', 'Payée', 'Annulée'],
    default: 'En attente'
  },
  dateVente: {
    type: Date,
    default: Date.now
  },
  datePaiement: {
    type: Date
  },
  numeroTransaction: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

venteSchema.index({ client: 1 });
venteSchema.index({ statut: 1 });
venteSchema.index({ dateVente: -1 });

venteSchema.methods.getFormattedTotal = function() {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'Frcfa'
  }).format(this.prixVente);
};

const VenteModel = mongoose.model<any>('Vente', venteSchema);
export default VenteModel;