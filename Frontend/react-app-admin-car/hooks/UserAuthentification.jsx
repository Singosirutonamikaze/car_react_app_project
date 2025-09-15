'use client';

import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/userContext";

export function UserAuthentication({ children }) {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (!user) updateUser(userData);
      } catch (error) {
        console.error('Erreur parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearUser();
      }
    } else {
      clearUser();
    }

    setIsLoading(false);
  }, [user, updateUser, clearUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#010B18] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
          <p className="text-slate-100/80 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
