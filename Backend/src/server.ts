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


server.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:5000',
      'http://localhost:8000',
      'http://50.50.67.135:3000',
      "http://localhost:5173"
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);


server.use(express.json());


// s'assurer que uploads existe et le servir
const uploadsPath = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsPath)){
   fs.mkdirSync(uploadsPath, { recursive: true });
}

server.use('/uploads', express.static(uploadsPath));


// connexion DB
connectDB();

// Routes protégées avec permissions spécifiques
server.use('/api/admin/cars', carRoutes);
server.use('/api/admin/orders', orderRoutes);
server.use('/api/admin/ventes', ventesRoutes);

// routes versionnées
server.use('/api/version/auth', authRoutes);
server.use('/api/version/clients', clientsRoutes);
server.use('/api/version/admin', adminRoutes);

server.use('/api/version/dashboard', dashboardRoutes);

server.use(errorHandler);
server.use(notFound);


server.get('/', (_req, res) => res.send('Hello World'));

export default server;