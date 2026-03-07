export const API_BASE_URL = "https://carreactappproject-production.up.railway.app";

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
  ADMIN: {
    LOGIN: `/api/version/admin/auth/login`,
    PROFILE: `/api/version/admin/auth/profile`,
    CHANGE_PASSWORD: `/api/version/admin/auth/change-password`,
  },
  CLIENTS: {
    GET_ALL: `/api/version/clients/get`,
    CREATE: `/api/version/clients/create`,
    UPDATE: `/api/version/clients/update/`,
    DELETE: (clientId) => `/api/version/clients/delete/${clientId}`,
    DOWNLOAD: `/api/version/clients/download`,
  },
  CARS: {
    GET_ALL: `/api/admin/cars/get`,
    GET_BY_ID: (carId) => `/api/admin/cars/${carId}`,
    CREATE: `/api/admin/cars/create`,
    UPDATE: (carId) => `/api/admin/cars/${carId}`,
    DELETE: (carId) => `/api/admin/cars/${carId}`,
    TOGGLE_AVAILABILITY: (carId) => `/api/admin/cars/${carId}/availability`,
    DOWNLOAD: `/api/admin/cars/download`,
  },
  ORDERS: {
    GET_ALL: `/api/admin/orders/admin/getAll`,
    CREATE: `/api/admin/orders/add`,
    UPDATE: (orderId) => `/api/admin/orders/update/${orderId}`,
    DELETE: (orderId) => `/api/admin/orders/delete/${orderId}`,
    DOWNLOAD: `/api/admin/orders/admin/downloads`,
  },
  SALES: {
    GET_ALL: `/api/admin/ventes/get`,
    GET_BY_ID: (saleId) => `/api/admin/ventes/${saleId}`,
    CREATE: `/api/admin/ventes/create`,
    UPDATE: (saleId) => `/api/admin/ventes/${saleId}`,
    UPDATE_STATUS: (saleId) => `/api/admin/ventes/${saleId}/status`,
    DELETE: (saleId) => `/api/admin/ventes/${saleId}`,
    STATS: `/api/admin/ventes/stats`,
    EXPORT: `/api/admin/ventes/export`,
  },
  ACHATS: {
    GET_USER: `/api/version/achat/admin/achats`,
    GET_ALL_FALLBACK: `/api/version/achat/admin/getAll`,
    CHARTS: `/api/version/achat/admin/achats/charts`,
    CREATE: `/api/version/achat/user/achats`,
    UPDATE_STATUS: (achatId) => `/api/version/achat/admin/achats/${achatId}/status`,
    ADD_EVALUATION: (achatId) => `/api/version/achat/user/achats/${achatId}/evaluation`,
  },
  LOCATIONS: {
    GET_ALL: `/api/version/locations/get`,
    GET_BY_ID: (locationId) => `/api/version/locations/${locationId}`,
    CREATE: `/api/version/locations/create`,
    UPDATE_STATUS: (locationId) => `/api/version/locations/${locationId}/statut`,
    DELETE: (locationId) => `/api/version/locations/${locationId}`,
    GET_BY_CLIENT: (clientId) => `/api/version/locations/client/${clientId}`,
  },
  FAVORITES: {
    GET_ALL: `/api/version/favorites/admin/favorites`,
    TOGGLE: `/api/version/favorites/user/favorites/toggle-clean`,
    REMOVE: (favoriteId) => `/api/version/favorites/admin/favorites/${favoriteId}`,
  },
  UPLOADS: {
    GET_IMAGE: (filename) => `/uploads/${filename}`,
  },
  HEALTH: '/health',
  PING: '/ping',
};

export { API_PATHS };
