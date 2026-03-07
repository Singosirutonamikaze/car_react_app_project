import axiosInstance from '../axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

export const getAllCars = async () => {
  const res = await axiosInstance.get(API_PATHS.CARS.GET_ALL);
  return res.data;
};

export const getCarById = async (carId) => {
  const res = await axiosInstance.get(API_PATHS.CARS.GET_BY_ID(carId));
  return res.data;
};

export const createCar = async (data) => {
  const res = await axiosInstance.post(API_PATHS.CARS.CREATE, data);
  return res.data;
};

export const updateCar = async (carId, data) => {
  const res = await axiosInstance.put(API_PATHS.CARS.UPDATE(carId), data);
  return res.data;
};

export const deleteCar = async (carId) => {
  const res = await axiosInstance.delete(API_PATHS.CARS.DELETE(carId));
  return res.data;
};

export const toggleCarAvailability = async (carId) => {
  const res = await axiosInstance.patch(API_PATHS.CARS.TOGGLE_AVAILABILITY(carId));
  return res.data;
};

export const downloadCars = async () => {
  const res = await axiosInstance.get(API_PATHS.CARS.DOWNLOAD, { responseType: 'blob' });
  return res.data;
};
