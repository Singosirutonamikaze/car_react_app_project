import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/userContext';
import { loginAdmin, getAdminProfile, changePassword } from '../../service/auth/authService';

export const useAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const login = async (credentials) => {
    const data = await loginAdmin(credentials);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.admin || data.user));
      updateUser(data.admin || data.user);
      navigate('/dashboard');
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    clearUser();
    navigate('/login');
  };

  const fetchProfile = async () => {
    const data = await getAdminProfile();
    updateUser(data);
    return data;
  };

  const updatePassword = async (passwordData) => {
    return await changePassword(passwordData);
  };

  return { user, login, logout, fetchProfile, updatePassword };
};
