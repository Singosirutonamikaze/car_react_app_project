import axiosInstance from '../axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

export const getDashboardData = async () => {
  const res = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DASHBOARD_DATA);
  return res.data;
};
