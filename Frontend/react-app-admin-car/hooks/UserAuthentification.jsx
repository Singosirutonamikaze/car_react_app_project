'use client';
import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const withUserAuthentication = (WrappedComponent) => {
  return class WithUserAuthentication extends Component {
    static contextType = UserContext;
    
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        isAuthenticated: false,
        shouldRedirect: false
      };
    }
    
    componentDidMount() {
      this.checkAuthentication();
    }
    
    checkAuthentication = async () => {
      const { user, updateUser, clearUser } = this.context;

      // Vérifier d'abord le localStorage
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (!user) {
            updateUser(userData);
          }
          this.setState({ isLoading: false, isAuthenticated: true });
          return;
        } catch (error) {
          console.error('Erreur parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      // Si pas de token ou user valide, rediriger vers login
      clearUser();
      this.setState({ isLoading: false, shouldRedirect: true });
    };
    
    render() {
      const { isLoading, isAuthenticated, shouldRedirect } = this.state;
      
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
      
      if (shouldRedirect) {
        return <Navigate to="/login" replace />;
      }
      
      if (isAuthenticated) {
        return <WrappedComponent {...this.props} />;
      }
      
      return <Navigate to="/login" replace />;
    }
  };
};