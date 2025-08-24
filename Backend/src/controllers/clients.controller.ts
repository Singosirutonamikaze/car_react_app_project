// controllers/clients.controller.js
import { Request, Response } from 'express';
import UserModel from '../models/Client';
import generateToken from '../utils/generateToken';

export const getClients = async (_req: Request, res: Response): Promise<void> => {
    try {
        const clients = await UserModel.find().select('-password');
        res.json(clients);
    } catch (error) {
        console.error("Erreur lors de la récupération des clients :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

export const createClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, surname, email, password } = req.body;

        if (!name || !surname || !email || !password) {
            res.status(400).json({ message: "S'il vous plaît, remplissez tous les champs." });
            return;
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
            return;
        }

        const newUser = new UserModel({
            name,
            surname,
            email,
            password,
        });

        await newUser.save();

        const token = generateToken(newUser._id.toString());
        const userToReturn = newUser.toObject();
        delete (userToReturn as any).password;

        res.status(201).json({ token, user: userToReturn });
    } catch (error: any) {
        if (error?.code === 11000 && error.keyPattern?.email) {
            res.status(400).json({ message: "L'email est déjà utilisé." });
            return;
        }
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

export const updateClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id, ...updates } = req.body; 

        console.log('Données reçues:', req.body);
        console.log('ID client:', _id);
        console.log('Updates:', updates);

        if (!_id) {
            res.status(400).json({
                message: 'ID du client requis'
            });
            return;
        }

        if (updates.password === '' || updates.password === undefined) {
            delete updates.password;
        }

        const client = await UserModel.findByIdAndUpdate(
            _id, 
            updates, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!client) {
            res.status(404).json({
                message: 'Client introuvable'
            });
            return;
        }

        console.log('Client mis à jour:', client);
        res.json(client);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du client :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

export const deleteClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                message: 'ID du client requis'
            });
            return;
        }

        const client = await UserModel.findByIdAndDelete(id);

        if (!client) {
            res.status(404).json({
                message: 'Client introuvable'
            });
            return;
        }

        res.json({ message: 'Client supprimé avec succès' });
    } catch (error) {
        console.error("Erreur lors de la suppression du client :", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

export const downloadClientsPDF = async (_req: Request, res: Response): Promise<void> => {
    try {
        const clients = await UserModel.find().select('-password');
        
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument();
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=clients.pdf');
      
        doc.pipe(res);
        
        doc.fontSize(20).text('Liste des Clients', 50, 50);
        doc.moveDown(2);
        
        // Headers du tableau
        doc.fontSize(12);
        let yPosition = 120;
        doc.text('Nom', 50, yPosition);
        doc.text('Prénom', 150, yPosition);
        doc.text('Email', 250, yPosition);
        doc.text('Date création', 400, yPosition);
        
        // Ligne de séparation
        doc.moveTo(50, yPosition + 20).lineTo(550, yPosition + 20).stroke();
        yPosition += 30;

        clients.forEach((client, index) => {
            if (yPosition > 700) { 
                doc.addPage();
                yPosition = 50;
            }
            
            doc.text(client.name || 'N/A', 50, yPosition);
            doc.text(client.surname || 'N/A', 150, yPosition);
            doc.text(client.email || 'N/A', 250, yPosition);
            doc.text(
                client.createdAt ? new Date(client.createdAt).toLocaleDateString('fr-FR') : 'N/A', 
                400, 
                yPosition
            );
            
            yPosition += 25;
        });

        doc.fontSize(10).text(`Total: ${clients.length} clients`, 50, yPosition + 20);
        doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 50, yPosition + 35);
        
        doc.end();
        
    } catch (error) {
        console.error("Erreur lors de la génération du PDF :", error);
        res.status(500).json({ message: 'Erreur lors de la génération du PDF.' });
    }
};