import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { LuLogIn, LuShieldCheck } from "react-icons/lu";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import UserContext from "../../context/userContext";
import { API_PATHS } from "../../utils/apiPath";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../service/axiosInstance";

const Login = () => {
  const { updateUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setShouldRedirect(true);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (!validateEmail(email)) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.ADMIN.LOGIN, {
        email,
        password,
      });

      if (response.data?.success) {
        const { token, user } = response.data.data;

        if (token && user) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          updateUser(user);
          setShouldRedirect(true);
          return;
        }

        setError("Donnees de connexion invalides");
      } else {
        setError(response.data?.message || "Erreur de connexion");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect");
      } else {
        setError(err.response?.data?.message || "Une erreur s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  if (shouldRedirect) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      <div className="lg:w-[75%] flex flex-col justify-center h-full">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-600 to-cyan-800 flex items-center justify-center shadow-lg shadow-cyan-950/35">
            <LuShieldCheck className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-cyan-100">CarsHub Admin</h3>
            <p className="text-xs text-cyan-100/70">
              Espace administrateur securise
            </p>
          </div>
        </div>

        <p className="text-sm text-cyan-100/75 mb-7 mt-4 border-l-2 border-cyan-300/45 pl-3">
          Connectez-vous pour acceder au tableau de bord
        </p>

        <form onSubmit={handleLogin} className="space-y-1">
          <Input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            label="Adresse email"
            placeholder="admin@example.com"
            type="email"
            disabled={loading}
          />

          <Input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            label="Mot de passe"
            placeholder="Minimum 8 caracteres"
            type="password"
            disabled={loading}
          />

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2">
              <span className="text-red-400 text-lg mt-0.5">!</span>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-linear-to-r from-cyan-700 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-950/40 hover:shadow-cyan-900/55 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connexion en cours...
              </>
            ) : (
              <>
                <LuLogIn className="text-xl" />
                Se connecter
              </>
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
