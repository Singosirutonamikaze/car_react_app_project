// routes/clients.routes.js
import express from 'express';
import { getClients, createClient, updateClient, deleteClient, downloadClientsPDF } from '../controllers/clientsController';
import { adminProtect } from '../middleware/authMiddleware';
const router = express.Router();

/**
 * @swagger
 * /clients/get:
 *   get:
 *     summary: Récupérer la liste des clients (admin)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/get', adminProtect, getClients);

/**
 * @swagger
 * /clients/create:
 *   post:
 *     summary: Créer un client (admin)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nom, email, telephone]
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telephone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client créé
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/create', adminProtect, createClient);

/**
 * @swagger
 * /clients/update/:
 *   put:
 *     summary: Mettre à jour un client (admin)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client mis à jour
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/update/', adminProtect, updateClient);

/**
 * @swagger
 * /clients/delete/{id}:
 *   delete:
 *     summary: Supprimer un client (admin)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du client à supprimer
 *     responses:
 *       200:
 *         description: Client supprimé
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/delete/:id', adminProtect, deleteClient);

/**
 * @swagger
 * /clients/download:
 *   get:
 *     summary: Télécharger la liste des clients en PDF (admin)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Fichier PDF téléchargé
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/download', adminProtect, downloadClientsPDF);

export default router;