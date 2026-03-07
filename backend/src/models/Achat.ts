import { model, Schema } from "mongoose";
import { IAchatDocument } from "../interfaces/IAchat";

const achatSchema = new Schema<IAchatDocument>({
  voiture: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  commande: {
    type: Schema.Types.ObjectId,
    ref: 'Commande',
    required: true
  },
  prixAchat: {
    type: Number,
    required: true,
    min: 0
  },
  statut: {
    type: String,
    enum: ['En attente', 'Confirmé', 'Payé', 'Livré', 'Terminé', 'Annulé'],
    default: 'En attente'
  },
  dateAchat: {
    type: Date,
    default: Date.now
  },
  datePaiement: {
    type: Date
  },
  dateLivraison: {
    type: Date
  },
  numeroTransaction: {
    type: String,
    unique: true,
    sparse: true
  },
  modePaiement: {
    type: String,
    enum: ['Espèces', 'Virement', 'Chèque', 'Financement'],
    required: true
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  evaluation: {
    note: {
      type: Number,
      min: 1,
      max: 5
    },
    commentaire: {
      type: String,
      maxlength: 500
    },
    dateEvaluation: {
      type: Date
    }
  }
}, {
  timestamps: true
});

achatSchema.index({ voiture: 1 });
achatSchema.index({ commande: 1 });
achatSchema.index({ statut: 1 });
achatSchema.index({ dateAchat: -1 });

export const AchatModel = model<IAchatDocument>('Achat', achatSchema);
