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
  AUTH: {
    LOGIN: `/api/version/auth/login`,
    REGISTER: `/api/version/auth/register`,
    GET_USER: `/api/version/auth/getUser`,
    UPDATE_USER: `/api/version/auth/updateUser`,
    DELETE_USER: `/api/version/auth/delete/myaccount/:id`,
    UPDATE_PASSWORD: `/api/version/auth/update/password`,
    FORGOT_PASSWORD: `/api/version/auth/forgot/password`,
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
    GET_ALL: `/api/admin/orders/getAll`,
    CREATE: `/api/admin/orders/add`,
    UPDATE: (orderId: string) => `/api/admin/orders/update/${orderId}`,
    DELETE: (orderId: string) => `/api/admin/orders/delete/${orderId}`,
    DOWNLOAD: `/api/admin/orders/downloads`,
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
  FAVORITES: {
    GET_ALL: `/api/version/favorites/user/favorites`,
    ADD: `/api/version/favorites/user/favorites`,
    REMOVE: (favoriteId: string) => `/api/version/favorites/user/favorites/${favoriteId}`,
    TOGGLE: `/api/version/favorites/user/favorites/toggle`,
    TOGGLE_SIMPLE: `/api/version/favorites/user/favorites/toggle-simple`,
    TOGGLE_CLEAN: `/api/version/favorites/user/favorites/toggle-clean`,
    LIST: `/api/version/favorites/user/favorites/liste`,
  },
  USER: {
    GET_PROFILE: `/api/version/client/user/profile`,
    UPDATE_PROFILE: `/api/version/client/user/update-profile`,
    CHANGE_PASSWORD: `/api/version/auth/update/password`,
    DELETE_ACCOUNT: (userId: string) => `/api/version/auth/delete/myaccount/${userId}`,
    GET_USER_DATA: `/api/version/client/userData`,
    GET_USER_ENHANCED: `/api/version/client/user/enhanced`,
    GET_USER_LIGHT: `/api/version/client/user/light`,
    GET_USER_PAGINATED: `/api/version/client/user/paginated`,
    GET_USER_COMPATIBLE: `/api/version/client/user/compatible`,
  },
  ACHATS: {
    GET_ALL: `/api/version/achat/user/achats`,
    CHARTS: `/api/version/achat/user/achats/charts`,
    CREATE: `/api/version/achat/user/achats`,
    UPDATE_STATUS: (id: string) => `/api/version/achat/user/achats/${id}/status`,
    ADD_EVALUATION: (id: string) => `/api/version/achat/user/achats/${id}/evaluation`,
  },
  HEALTH: "/health",
  PING: "/ping",
};

export { API_PATHS };
