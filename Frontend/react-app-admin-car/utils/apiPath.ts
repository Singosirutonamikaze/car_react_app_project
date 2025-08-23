// utils/apiPath.js
export const API_BASE_URL = "http://localhost:8000";

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
    UPDATE: `/api/version/clients/update`,
    DELETE: (clientId: string) => `/api/version/clients/delete/${clientId}`,
  },
  CARS: {
    GET_ALL: `/api/version/cars/get`,
    GET_BY_ID: (carId: string) => `/api/version/cars/${carId}`,
    CREATE: `/api/version/cars/create`,
    UPDATE: (carId: string) => `/admin/cars/${carId}`,
    DELETE: (carId: string) => `/admin/cars/${carId}`,
    TOGGLE_AVAILABILITY: (carId: string) => `/admin/cars/${carId}/availability`,
  },
  ORDERS: {
    GET_ALL: `/admin/orders/getAll`,
    CREATE: `/admin/orders/add`,
    UPDATE: (orderId: string) => `/admin/orders/update/${orderId}`,
    DELETE: (orderId: string) => `/admin/orders/delete/${orderId}`,
    DOWNLOAD: `/admin/orders/downloads`,
  },
  SALES: {
    GET_ALL: `/admin/ventes/get`,
    GET_BY_ID: (saleId: string) => `/admin/ventes/${saleId}`,
    CREATE: `/admin/ventes/create`,
    UPDATE: (saleId: string) => `/admin/ventes/${saleId}`,
    UPDATE_STATUS: (saleId: string) => `/admin/ventes/${saleId}/status`,
    DELETE: (saleId: string) => `/admin/ventes/${saleId}`,
    STATS: `/admin/ventes/stats`,
    EXPORT: `/admin/ventes/export`,
  },
  UPLOADS: {
    GET_IMAGE: (filename: string) => `/uploads/${filename}`,
  }
};

export { API_PATHS };