// src/index.ts - Configuration CORS corrigée
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import clientsRoutes from './routes/clients.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import carRoutes from './routes/cars.routes';
import orderRoutes from './routes/commands.routes';
import ventesRoutes from './routes/ventes.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const server = express();

// Configuration CORS améliorée
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:8000',
  'http://50.50.67.135:3000',
  'http://localhost:5173',
  'https://car-react-app-project.vercel.app',
  /^https:\/\/.*\.vercel\.app$/,
  process.env.FRONTEND_URL
];

server.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      // Vérifier si l'origin est autorisé
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (typeof allowedOrigin === 'string') {
          return allowedOrigin === origin;
        } else if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log('Origin bloqué par CORS:', origin);
        callback(new Error('Non autorisé par la politique CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    credentials: true,
    optionsSuccessStatus: 200 
  })
);

// Middleware supplémentaire pour les headers CORS
server.use((req, res, next) => {
  const origin = req.headers.origin;

  // Vérifier si l'origin est autorisé
  const isAllowed = allowedOrigins.some(allowedOrigin => {
    if (typeof allowedOrigin === 'string') {
      return allowedOrigin === origin;
    } else if (allowedOrigin instanceof RegExp) {
      return allowedOrigin.test(origin as string);
    }
    return false;
  });

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin as string);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept, Origin'
  );

  // Répondre aux requêtes OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
});

server.use(express.json());

// S'assurer que uploads existe et le servir
const uploadsPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
server.use('/uploads', express.static(uploadsPath));

// Connexion DB
connectDB();

// Routes protégées avec permissions spécifiques
server.use('/api/admin/cars', carRoutes);
server.use('/api/admin/orders', orderRoutes);
server.use('/api/admin/ventes', ventesRoutes);

// Routes versionnées
server.use('/api/version/auth', authRoutes);
server.use('/api/version/clients', clientsRoutes);
server.use('/api/version/admin', adminRoutes);
server.use('/api/version/dashboard', dashboardRoutes);

// Route de santé pour vérifier le serveur
server.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Serveur en fonctionnement',
    timestamp: new Date().toISOString()
  });
});

server.use(errorHandler);
server.use(notFound);

server.get('/', (_req, res) => res.send('Hello World'));

export default server;