import axiosInstance from '../axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

export const getAllClients = async () => {
  const res = await axiosInstance.get(API_PATHS.CLIENTS.GET_ALL);
  return res.data;
};

export const createClient = async (data) => {
  const res = await axiosInstance.post(API_PATHS.CLIENTS.CREATE, data);
  return res.data;
};

export const updateClient = async (clientId, data) => {
  const res = await axiosInstance.put(API_PATHS.CLIENTS.UPDATE, { ...data, _id: clientId });
  return res.data;
};

export const deleteClient = async (clientId) => {
  const res = await axiosInstance.delete(API_PATHS.CLIENTS.DELETE(clientId));
  return res.data;
};

export const downloadClients = async () => {
  const res = await axiosInstance.get(API_PATHS.CLIENTS.DOWNLOAD, { responseType: 'blob' });
  return res.data;
};
