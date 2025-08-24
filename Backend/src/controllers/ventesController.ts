import { Request, Response } from 'express';
import VenteModel from '../models/Vente';
import CommandeModel from '../models/Commande';
import CarModel from '../models/Car';
import { IVente } from '../interfaces/IVente';

export const getAllVentes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { statut, startDate, endDate } = req.query;

    let filter: any = {};

    if (statut) filter.statut = statut;
    if (startDate || endDate) {
      filter.dateVente = {};
      if (startDate) filter.dateVente.$gte = new Date(startDate as string);
      if (endDate) filter.dateVente.$lte = new Date(endDate as string);
    }

    const ventes = await VenteModel.find(filter)
      .populate('voiture', 'marque model year')
      .populate('client', 'name surname email')
      .populate('commande', 'statut montantTotal');

    res.status(200).json({
      success: true,
      data: ventes,
      count: ventes.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des ventes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const getVenteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const vente = await VenteModel.findById(id)
      .populate('voiture')
      .populate('client')
      .populate('commande');

    if (!vente) {
      res.status(404).json({
        success: false,
        message: 'Vente non trouvée'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: vente
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la vente:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const createVente = async (req: Request, res: Response): Promise<void> => {
  try {
    const venteData: IVente = req.body;

    // Vérifier que la commande existe
    const commande = await CommandeModel.findById(venteData.commande);
    if (!commande) {
      res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
      return;
    }

    // Vérifier que la voiture existe
    const voiture = await CarModel.findById(venteData.voiture);
    if (!voiture) {
      res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
      return;
    }

    const newVente = new VenteModel(venteData);
    await newVente.save();

    // Populer les références pour la réponse
    const ventePopulee = await VenteModel.findById(newVente._id)
      .populate('voiture')
      .populate('client')
      .populate('commande');

    res.status(201).json({
      success: true,
      message: 'Vente créée avec succès',
      data: ventePopulee
    });
  } catch (error: any) {
    console.error('Erreur lors de la création de la vente:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }));

      res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const updateVente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const vente = await VenteModel.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('voiture')
      .populate('client')
      .populate('commande');

    if (!vente) {
      res.status(404).json({
        success: false,
        message: 'Vente non trouvée'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Vente mise à jour avec succès',
      data: vente
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la vente:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }));

      res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const deleteVente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const vente = await VenteModel.findByIdAndDelete(id);

    if (!vente) {
      res.status(404).json({
        success: false,
        message: 'Vente non trouvée'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Vente supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la vente:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const updateVenteStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!['En attente', 'Confirmée', 'Payée', 'Annulée'].includes(statut)) {
      res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
      return;
    }

    const vente = await VenteModel.findByIdAndUpdate(
      id,
      { statut },
      { new: true }
    )
      .populate('voiture')
      .populate('client')
      .populate('commande');

    if (!vente) {
      res.status(404).json({
        success: false,
        message: 'Vente non trouvée'
      });
      return;
    }

    // Si la vente est payée, mettre à jour la date de paiement
    if (statut === 'Payée') {
      vente.datePaiement = new Date();
      await vente.save();
    }

    res.status(200).json({
      success: true,
      message: 'Statut de la vente mis à jour',
      data: vente
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const getVentesStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await VenteModel.aggregate([
      {
        $group: {
          _id: '$statut',
          count: { $sum: 1 },
          totalAmount: { $sum: '$prixVente' }
        }
      }
    ]);

    const totalVentes = await VenteModel.countDocuments();
    const totalRevenue = await VenteModel.aggregate([
      { $match: { statut: 'Payée' } },
      { $group: { _id: null, total: { $sum: '$prixVente' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statsByStatus: stats,
        totalVentes,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

export const downloadVente = async (req: Request, res: Response): Promise<void> => {
  // Implémentation de l'export des ventes
  try {
    const ventes = await VenteModel.find()
      .populate('voiture', 'marque model year price')
      .populate('client', 'name surname email')
      .populate('commande', 'statut montantTotal');

    const dataForExport = ventes.map(vente => ({
      'Numéro Vente': vente._id,
      'Client': vente.client ? `${vente.client.name} ${vente.client.surname}` : '',
      'Email Client': vente.client?.email || '',
      'Voiture': vente.voiture ? `${vente.voiture.marque} ${vente.voiture.model} (${vente.voiture.year})` : '',
      'Prix de Vente': vente.prixVente,
      'Statut': vente.statut,
      'Date Vente': vente.dateVente,
      'Date Paiement': vente.datePaiement || '',
      'Numéro Transaction': vente.numeroTransaction || '',
      'Commande Associée': vente.commande?._id || ''
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=ventes.csv');

    let csv = 'Numéro Vente,Client,Email Client,Voiture,Prix de Vente,Statut,Date Vente,Date Paiement,Numéro Transaction,Commande Associée\n';

    dataForExport.forEach(row => {
      csv += `"${Object.values(row).join('","')}"\n`;
    });

    res.status(200).send(csv);
  } catch (error) {
    console.error('Erreur lors de l\'export des ventes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export des ventes'
    });
  }
};