import axiosInstance from '../axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

export const loginAdmin = async (credentials) => {
  const res = await axiosInstance.post(API_PATHS.ADMIN.LOGIN, credentials);
  return res.data;
};

export const getAdminProfile = async () => {
  const res = await axiosInstance.get(API_PATHS.ADMIN.PROFILE);
  return res.data;
};

export const changePassword = async (data) => {
  const res = await axiosInstance.put(API_PATHS.ADMIN.CHANGE_PASSWORD, data);
  return res.data;
};
