import swaggerJSDoc from 'swagger-jsdoc';
import path from 'node:path';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Next Car Dev API',
      version: '1.0.0',
      description:
        'API REST complète pour la gestion de ventes, commandes et locations de voitures.',
      contact: {
        name: 'SINGO Yao Dieu Donné',
        email: 'contact@nextcardev.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Serveur de développement',
      },
      {
        url: 'https://car-react-app-project.up.railway.app',
        description: 'Serveur de production (Railway)',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre token JWT : **Bearer &lt;token&gt;**',
        },
      },
      schemas: {
        // ─── Auth ────────────────────────────────────────────────────────
        RegisterInput: {
          type: 'object',
          required: ['name', 'surname', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Jean' },
            surname: { type: 'string', example: 'Dupont' },
            email: { type: 'string', format: 'email', example: 'jean@example.com' },
            password: { type: 'string', format: 'password', minLength: 6, example: 'Secret123!' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'jean@example.com' },
            password: { type: 'string', format: 'password', example: 'Secret123!' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        // ─── User ────────────────────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64abc123def456789' },
            name: { type: 'string', example: 'Jean' },
            surname: { type: 'string', example: 'Dupont' },
            email: { type: 'string', example: 'jean@example.com' },
            profileImageUrl: { type: 'string', nullable: true, example: 'https://cdn.example.com/avatar.jpg' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        // ─── Car ─────────────────────────────────────────────────────────
        Car: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64abc123def456789' },
            marque: { type: 'string', example: 'Toyota' },
            modelCar: { type: 'string', example: 'Corolla' },
            year: { type: 'integer', example: 2022 },
            description: { type: 'string', example: 'Berline économique' },
            price: { type: 'number', example: 18500 },
            couleur: { type: 'string', example: 'Blanc' },
            kilometrage: { type: 'integer', example: 12000 },
            carburant: { type: 'string', example: 'Essence' },
            image: { type: 'string', nullable: true },
            disponible: { type: 'boolean', example: true },
            ville: { type: 'string', example: 'Paris' },
          },
        },
        CarInput: {
          type: 'object',
          required: ['marque', 'modelCar', 'year', 'description', 'price', 'couleur', 'kilometrage', 'carburant', 'ville'],
          properties: {
            marque: { type: 'string', example: 'Toyota' },
            modelCar: { type: 'string', example: 'Corolla' },
            year: { type: 'integer', example: 2022 },
            description: { type: 'string', example: 'Berline économique' },
            price: { type: 'number', example: 18500 },
            couleur: { type: 'string', example: 'Blanc' },
            kilometrage: { type: 'integer', example: 12000 },
            carburant: { type: 'string', example: 'Essence' },
            disponible: { type: 'boolean', default: true },
            ville: { type: 'string', example: 'Paris' },
          },
        },
        // ─── Commande ────────────────────────────────────────────────────
        Commande: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            client: { $ref: '#/components/schemas/User' },
            voiture: { $ref: '#/components/schemas/Car' },
            statut: {
              type: 'string',
              enum: ['En attente', 'Confirmée', 'En cours', 'Livrée', 'Annulée'],
              example: 'En attente',
            },
            montant: { type: 'number', example: 18500 },
            fraisLivraison: { type: 'number', example: 150 },
            montantTotal: { type: 'number', example: 18650 },
            modePaiement: {
              type: 'string',
              enum: ['Espèces', 'Virement', 'Chèque', 'Financement'],
            },
            adresseLivraison: {
              type: 'object',
              properties: {
                rue: { type: 'string' },
                ville: { type: 'string' },
                codePostal: { type: 'string' },
                pays: { type: 'string' },
              },
            },
            dateCommande: { type: 'string', format: 'date-time' },
          },
        },
        // ─── Vente ───────────────────────────────────────────────────────
        Vente: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            voiture: { $ref: '#/components/schemas/Car' },
            client: { $ref: '#/components/schemas/User' },
            commande: { $ref: '#/components/schemas/Commande' },
            prixVente: { type: 'number', example: 18500 },
            statut: {
              type: 'string',
              enum: ['En attente', 'Confirmée', 'Payée', 'Annulée'],
            },
            dateVente: { type: 'string', format: 'date-time' },
            datePaiement: { type: 'string', format: 'date-time', nullable: true },
            numeroTransaction: { type: 'string', nullable: true },
          },
        },
        // ─── Location ────────────────────────────────────────────────────
        Location: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            voiture: { $ref: '#/components/schemas/Car' },
            client: { $ref: '#/components/schemas/User' },
            dateDebut: { type: 'string', format: 'date-time' },
            dateFin: { type: 'string', format: 'date-time' },
            dureeJours: { type: 'integer', example: 5 },
            prixParJour: { type: 'number', example: 80 },
            montantTotal: { type: 'number', example: 400 },
            statut: {
              type: 'string',
              enum: ['En attente', 'Active', 'Terminée', 'Annulée'],
            },
          },
        },
        // ─── Erreurs ─────────────────────────────────────────────────────
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Erreur interne du serveur' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Opération réussie' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentification et gestion du compte utilisateur' },
      { name: 'Voitures', description: 'CRUD des voitures (admin)' },
      { name: 'Commandes', description: 'Gestion des commandes' },
      { name: 'Ventes', description: 'Gestion des ventes (admin)' },
      { name: 'Locations', description: 'Location de voitures' },
      { name: 'Favoris', description: 'Favoris du client' },
      { name: 'Achats', description: 'Achats du client' },
      { name: 'Dashboard', description: 'Statistiques et données agrégées (admin)' },
      { name: 'Admin', description: 'Gestion du compte administrateur' },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../routes/*.js'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
