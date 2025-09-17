export const API_BASE_URL = "https://car-app-backend-w29j.onrender.com";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 60000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

const API_PATHS = {
  DASHBOARD: {
    GET_DASHBOARD_DATA: `/api/version/dashboard`,
  },
  AUTH: {
    LOGIN: `/api/version/auth/login`,
    REGISTER: `/api/version/auth/register`,
    GET_USER: `/api/version/auth/getUser`,
  },
  CLIENTS: {
    GET_ALL: `/api/version/clients/get`,
    CREATE: `/api/version/clients/create`,
    UPDATE: `/api/version/clients/update/`,
    DELETE: (clientId: string) => `/api/version/clients/delete/${clientId}`,
    DOWNLOAD: `/api/version/clients/download`,
  },
  CARS: {
    GET_ALL: `/api/admin/cars/get`,
    GET_BY_ID: (carId: string) => `/api/admin/cars/${carId}`,
    CREATE: `/api/admin/cars/create`,
    UPDATE: (carId: string) => `/api/admin/cars/${carId}`,
    DELETE: (carId: string) => `/api/admin/cars/${carId}`,
    TOGGLE_AVAILABILITY: (carId: string) => `/api/admin/cars/${carId}/availability`,
    DOWNLOAD: `/api/admin/cars/download`,
  },
  ORDERS: {
    GET_ALL: `/api/admin/orders/admin/getAll`,
    CREATE: `/api/admin/orders/add`,
    UPDATE: (orderId: string) => `/api/admin/orders/update/${orderId}`,
    DELETE: (orderId: string) => `/api/admin/orders/delete/${orderId}`,
    DOWNLOAD: `/api/admin/orders/admin/downloads`,
  },
  SALES: {
    GET_ALL: `/api/admin/ventes/get`,
    GET_BY_ID: (saleId: string) => `/api/admin/ventes/${saleId}`,
    CREATE: `/api/admin/ventes/create`,
    UPDATE: (saleId: string) => `/api/admin/ventes/${saleId}`,
    UPDATE_STATUS: (saleId: string) => `/api/admin/ventes/${saleId}/status`,
    DELETE: (saleId: string) => `/api/admin/ventes/${saleId}`,
    STATS: `/api/admin/ventes/stats`,
    EXPORT: `/api/admin/ventes/export`,
  },
  UPLOADS: {
    GET_IMAGE: (filename: string) => `/uploads/${filename}`,
  },
  HEALTH: '/health',
  PING: '/ping',
};

export { API_PATHS };