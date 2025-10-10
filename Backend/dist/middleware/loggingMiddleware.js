"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.requestLogger = exports.logAction = void 0;
const logAction = (action) => {
    return (req, res, next) => {
        if (req.admin) {
            console.log(`[${new Date().toISOString()}] Admin ${req.admin.email} (${req.admin.adminId}) - Action: ${action}`);
        }
        else if (req.user) {
            console.log(`[${new Date().toISOString()}] User ${req.user.email} (${req.user.id}) - Action: ${action}`);
        }
        else {
            console.log(`[${new Date().toISOString()}] Unknown user - Action: ${action}`);
        }
        next();
    };
};
exports.logAction = logAction;
// Middleware pour logger toutes les requêtes
const requestLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};
exports.requestLogger = requestLogger;
// Middleware pour logger les erreurs
const errorLogger = (error, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error: ${error.message}`);
    console.error(error.stack);
    next(error);
};
exports.errorLogger = errorLogger;
