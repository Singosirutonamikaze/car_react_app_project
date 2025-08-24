import React, { Component } from 'react';
import AuthLayout from '../components/layouts/AuthLayout';
import { Navigate } from 'react-router-dom';
import Input from '../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../service/axiosInstance';

class Login extends Component {
  static contextType = UserContext;
  
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: null,
      loading: false,
      shouldRedirect: false,
    };
  }

  componentDidMount() {
    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem('token');
    if (token) {
      this.setState({ shouldRedirect: true });
    }
  }

  handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    const { updateUser } = this.context;

    let hasError = false;
    let errorMessage = "";

    if (!email || !password) {
      hasError = true;
      errorMessage = "Veuillez remplir tous les champs";
    }

    if (!validateEmail(email)) {
      hasError = true;
      errorMessage = "Veuillez entrer une adresse email valide";
    }

    if (password.length < 8) {
      hasError = true;
      errorMessage = "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (hasError) {
      this.setState({ error: errorMessage });
      return;
    }

    this.setState({ error: null, loading: true });

    try {
      const response = await axiosInstance.post(API_PATHS.ADMIN.LOGIN, {
        email,
        password,
      });

      console.log('Réponse login:', response.data);

      // Vérifier la structure de la réponse selon votre contrôleur
      if (response.data && response.data.success) {
        const { token, user } = response.data.data;

        if (token && user) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          
          // Mettre à jour le contexte
          updateUser(user);
          
          this.setState({ shouldRedirect: true, loading: false });
        } else {
          this.setState({ 
            error: "Données de connexion invalides", 
            loading: false 
          });
        }
      } else {
        this.setState({ 
          error: response.data?.message || "Erreur de connexion", 
          loading: false 
        });
      }

    } catch (error) {
      console.log('Erreur login:', error);
      let errorMessage = "Une erreur s'est produite lors de la connexion";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Email ou mot de passe incorrect";
      }
      
      this.setState({ error: errorMessage, loading: false });
    }
  }

  render() {
    const { email, password, error, loading, shouldRedirect } = this.state;

    if (shouldRedirect) {
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <AuthLayout>
        <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
          <h3 className="text-xl font-semibold text-white mb-2">
            Bienvenue sur CarsHub Admin
          </h3>
          <p className='text-xs text-white/80 mb-6'>
            Veuillez entrer vos détails de connexion.
          </p>

          <form onSubmit={this.handleLogin}>
            <Input
              value={email}
              onChange={(e) => this.setState({ email: e.target.value })}
              label="Votre adresse email"
              placeholder="admin@example.com"
              type="email"
              className="text-white"
              disabled={loading}
            />

            <Input
              value={password}
              onChange={(e) => this.setState({ password: e.target.value })}
              label="Votre mot de passe"
              placeholder="Minimum 8 caractères"
              type="password"
              className="text-white"
              disabled={loading}
            />
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className='text-red-300 text-sm'>{error}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full py-3 mt-4 bg-gradient-to-r from-violet-600 to-violet-700 
                       hover:from-violet-700 hover:to-violet-800 text-white font-semibold 
                       rounded-xl transition-all duration-200 shadow-lg
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>
      </AuthLayout>
    );
  }
}

export default Login;