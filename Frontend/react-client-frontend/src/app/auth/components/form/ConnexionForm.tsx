// src/app/auth/components/form/ConnexionForm.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../../../shared/services/authService";
import Input from "../inputs/Input";

function ConnexionForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.login(formData);

      if (response.token) {
        toast.success("Connexion réussie !");
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      console.error("Erreur de connexion:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Erreur lors de la connexion");
      } else {
        toast.error("Erreur lors de la connexion");
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-blue-900/30 backdrop-blur-md rounded-xl shadow-2xl border border-blue-700/30 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Connexion</h2>
          <p className="text-blue-200 mt-2">Accédez à votre compte CarHub</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="votre@email.com"
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Votre mot de passe"
            required
          />

          <div className="flex justify-end">
            <Link
              to="/mot-de-passe-oublie"
              className="text-blue-300 hover:text-blue-100 text-sm transition-colors"
            >
              Mot de passe oublié?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-blue-200">
            Pas encore de compte?{" "}
            <Link
              to="/inscription"
              className="text-white font-semibold hover:text-blue-100 transition-colors"
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConnexionForm;