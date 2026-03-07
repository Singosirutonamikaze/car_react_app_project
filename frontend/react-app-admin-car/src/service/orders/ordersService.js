import axiosInstance from '../axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

export const getAllOrders = async () => {
  const res = await axiosInstance.get(API_PATHS.ORDERS.GET_ALL);
  return res.data;
};

export const createOrder = async (data) => {
  const res = await axiosInstance.post(API_PATHS.ORDERS.CREATE, data);
  return res.data;
};

export const updateOrder = async (orderId, data) => {
  const res = await axiosInstance.put(API_PATHS.ORDERS.UPDATE(orderId), data);
  return res.data;
};

export const deleteOrder = async (orderId) => {
  const res = await axiosInstance.delete(API_PATHS.ORDERS.DELETE(orderId));
  return res.data;
};

export const downloadOrders = async () => {
  const res = await axiosInstance.get(API_PATHS.ORDERS.DOWNLOAD, { responseType: 'blob' });
  return res.data;
};
