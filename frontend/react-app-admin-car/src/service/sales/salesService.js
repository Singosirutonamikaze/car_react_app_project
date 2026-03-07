import axiosInstance from '../axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

export const getAllSales = async () => {
  const res = await axiosInstance.get(API_PATHS.SALES.GET_ALL);
  return res.data;
};

export const getSaleById = async (saleId) => {
  const res = await axiosInstance.get(API_PATHS.SALES.GET_BY_ID(saleId));
  return res.data;
};

export const createSale = async (data) => {
  const res = await axiosInstance.post(API_PATHS.SALES.CREATE, data);
  return res.data;
};

export const updateSale = async (saleId, data) => {
  const res = await axiosInstance.put(API_PATHS.SALES.UPDATE(saleId), data);
  return res.data;
};

export const updateSaleStatus = async (saleId, status) => {
  const res = await axiosInstance.patch(API_PATHS.SALES.UPDATE_STATUS(saleId), { status });
  return res.data;
};

export const deleteSale = async (saleId) => {
  const res = await axiosInstance.delete(API_PATHS.SALES.DELETE(saleId));
  return res.data;
};

export const getSalesStats = async () => {
  const res = await axiosInstance.get(API_PATHS.SALES.STATS);
  return res.data;
};

export const exportSales = async () => {
  const res = await axiosInstance.get(API_PATHS.SALES.EXPORT, { responseType: 'blob' });
  return res.data;
};
