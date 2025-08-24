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
  } 
};

export { API_PATHS };