import mongoose from 'mongoose';

// Solution radicale : utiliser any pour éviter les problèmes de typage
const adresseLivraisonSchema = new mongoose.Schema({
  rue: {
    type: String,
    required: true,
    trim: true
  },
  ville: {
    type: String,
    required: true,
    trim: true
  },
  codePostal: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^\d{5}$/.test(v);
      },
      message: 'Code postal invalide'
    }
  },
  pays: {
    type: String,
    default: 'TOGO',
    trim: true
  }
});

// Créer le schéma sans typage générique
const commandeSchema = new mongoose.Schema({
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
  statut: {
    type: String,
    required: true,
    enum: ['En attente', 'Confirmée', 'En cours', 'Livrée', 'Annulée'],
    default: 'En attente'
  },
  montant: {
    type: Number,
    required: true,
    min: 0
  },
  fraisLivraison: {
    type: Number,
    default: 0,
    min: 0
  },
  montantTotal: {
    type: Number,
    required: false,
    min: 0
  },
  modePaiement: {
    type: String,
    required: true,
    enum: ['Espèces', 'Virement', 'Chèque', 'Financement']
  },
  adresseLivraison: {
    type: adresseLivraisonSchema,
    required: true
  },
  dateCommande: {
    type: Date,
    default: Date.now
  },
  dateLivraisonPrevue: {
    type: Date
  },
  dateLivraisonReelle: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

function toAmount(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const normalized = value.replaceAll(/[\s,]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

// Index pour les recherches
commandeSchema.index({ client: 1 });
commandeSchema.index({ statut: 1 });
commandeSchema.index({ dateCommande: -1 });

// Middleware pour calculer le montant total avant sauvegarde
commandeSchema.pre('save', function(next) {
  if (this.isModified('montant') || this.isModified('fraisLivraison')) {
    const montant = toAmount(this.montant);
    const fraisLivraison = toAmount(this.fraisLivraison);

    this.montant = montant;
    this.fraisLivraison = fraisLivraison;
    this.montantTotal = montant + fraisLivraison;
  }
  next();
});

// Middleware pour calculer le montant total avant mise à jour
commandeSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  if (update && (update.montant !== undefined || update.fraisLivraison !== undefined)) {
    if (!update.$set) update.$set = {};

    const nextMontant = update.montant ?? update.$set.montant ?? this.get('montant');
    const nextFraisLivraison = update.fraisLivraison ?? update.$set.fraisLivraison ?? this.get('fraisLivraison') ?? 0;
    const montant = toAmount(nextMontant);
    const fraisLivraison = toAmount(nextFraisLivraison);

    update.$set.montant = montant;
    update.$set.fraisLivraison = fraisLivraison;
    update.$set.montantTotal = montant + fraisLivraison;
  }
  next();
});

// Exporter avec any pour éviter les problèmes de typage
const CommandeModel = mongoose.model<any>('Commande', commandeSchema);
export default CommandeModel;