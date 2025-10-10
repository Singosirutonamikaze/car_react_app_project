"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts - Configuration CORS corrigée
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const clients_routes_1 = __importDefault(require("./routes/clients.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const cars_routes_1 = __importDefault(require("./routes/cars.routes"));
const commands_routes_1 = __importDefault(require("./routes/commands.routes"));
const ventes_routes_1 = __importDefault(require("./routes/ventes.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
dotenv_1.default.config();
const server = (0, express_1.default)();
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
server.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        // Vérifier si l'origin est autorisé
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return allowedOrigin === origin;
            }
            else if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });
        if (isAllowed) {
            callback(null, true);
        }
        else {
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
}));
// Middleware supplémentaire pour les headers CORS
server.use((req, res, next) => {
    const origin = req.headers.origin;
    // Vérifier si l'origin est autorisé
    const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (typeof allowedOrigin === 'string') {
            return allowedOrigin === origin;
        }
        else if (allowedOrigin instanceof RegExp) {
            return allowedOrigin.test(origin);
        }
        return false;
    });
    if (isAllowed) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    // Répondre aux requêtes OPTIONS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});
server.use(express_1.default.json());
// S'assurer que uploads existe et le servir
const uploadsPath = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsPath)) {
    fs_1.default.mkdirSync(uploadsPath, { recursive: true });
}
server.use('/uploads', express_1.default.static(uploadsPath));
// Connexion DB
(0, db_1.default)();
// Routes protégées avec permissions spécifiques
server.use('/api/admin/cars', cars_routes_1.default);
server.use('/api/admin/orders', commands_routes_1.default);
server.use('/api/admin/ventes', ventes_routes_1.default);
// Routes versionnées
server.use('/api/version/auth', auth_routes_1.default);
server.use('/api/version/clients', clients_routes_1.default);
server.use('/api/version/admin', admin_routes_1.default);
server.use('/api/version/dashboard', dashboard_routes_1.default);
// Route de santé pour vérifier le serveur
server.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Serveur en fonctionnement',
        timestamp: new Date().toISOString()
    });
});
server.use(errorMiddleware_1.errorHandler);
server.use(errorMiddleware_1.notFound);
server.get('/', (_req, res) => res.send('Hello World'));
exports.default = server;
