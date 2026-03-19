import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../inputs/Input";
import useAuth from "../../../../shared/hooks/auth";
import ROUTES from "../../../../router";

type AuthFormStyle = "style1" | "style2" | "style3";

const AUTH_FORM_STYLE_STORAGE_KEY = "auth-form-style";

const readAuthFormStyle = (): AuthFormStyle => {
  const stored = globalThis.localStorage?.getItem(AUTH_FORM_STYLE_STORAGE_KEY);
  if (stored === "style1" || stored === "style2" || stored === "style3") {
    return stored;
  }
  return "style1";
};

function InscriptionForm() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<AuthFormStyle>(readAuthFormStyle);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleStyleChange = (style: AuthFormStyle) => {
    setSelectedStyle(style);
    globalThis.localStorage?.setItem(AUTH_FORM_STYLE_STORAGE_KEY, style);
  };

  const cardStyleClassesByVariant: Record<AuthFormStyle, string> = {
    style1: "client-theme-card-soft rounded-[2rem]",
    style2: "client-theme-card rounded-lg",
    style3: "client-theme-glass-strong rounded-[1.5rem] backdrop-blur-xl",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.surname.trim()) {
      newErrors.surname = "Le prénom est requis";
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis"; // NOSONAR - Message de validation UI, pas un secret
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 caracteres"; // NOSONAR - Message de validation UI, pas un secret
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer le mot de passe"; // NOSONAR - Message de validation UI, pas un secret
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"; // NOSONAR - Message de validation UI, pas un secret
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        email: formData.email,
        password: formData.password,
      });
      toast.success("Inscription réussie !");
      navigate(ROUTES.DASHBOARD);
    } catch (error: unknown) {
      console.error("Erreur d'inscription:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Erreur lors de l'inscription");
      } else {
        toast.error("Erreur lors de l'inscription");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-3">
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleStyleChange("style1")}
          className={`px-3 py-1.5 text-xs border client-theme-outline-button ${selectedStyle === "style1" ? "client-theme-button" : ""}`}
        >
          1
        </button>
        <button
          type="button"
          onClick={() => handleStyleChange("style2")}
          className={`px-3 py-1.5 text-xs border client-theme-outline-button ${selectedStyle === "style2" ? "client-theme-button" : ""}`}
        >
          2
        </button>
        <button
          type="button"
          onClick={() => handleStyleChange("style3")}
          className={`px-3 py-1.5 text-xs border client-theme-outline-button ${selectedStyle === "style3" ? "client-theme-button" : ""}`}
        >
          3
        </button>
      </div>

      <div className={`relative overflow-hidden border client-auth-form-animate ${cardStyleClassesByVariant[selectedStyle]}`}>
        {selectedStyle === "style1" && (
          <div className="absolute -bottom-16 -left-10 w-44 h-44 rounded-full client-accent-bg opacity-45"></div>
        )}
        {selectedStyle === "style3" && (
          <div className="absolute -top-16 -right-12 w-52 h-52 rounded-full client-accent-bg-strong opacity-35 blur-2xl"></div>
        )}

        <div className="client-auth-dots" aria-hidden="true">
          <span className="client-auth-dot client-auth-dot-1"></span>
          <span className="client-auth-dot client-auth-dot-2"></span>
          <span className="client-auth-dot client-auth-dot-3"></span>
        </div>

        <div className={`relative z-10 ${selectedStyle === "style1" ? "grid md:grid-cols-[1fr_84px]" : ""}`}>
          <div className={`${selectedStyle === "style2" ? "border-l-2 border-slate-500/40" : ""} p-6 md:p-7`}>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.22em] client-theme-text-secondary mb-2">
                {selectedStyle === "style2" ? "Création de compte" : "Nouveau profil"}
              </p>
              <h2 className="text-xl md:text-2xl font-semibold client-theme-text-primary">Inscription</h2>
              <p className="text-sm client-theme-text-secondary mt-2">Rejoignez la communauté CarHub</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Votre nom"
                  required
                />

                <Input
                  label="Prénom"
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  error={errors.surname}
                  placeholder="Votre prénom"
                  required
                />
              </div>

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

              <Input
                label="Confirmer le mot de passe"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Confirmez votre mot de passe"
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 client-theme-button border font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Inscription..." : "S'inscrire"}
              </button>
            </form>

            <div className="mt-5">
              <p className="client-theme-text-secondary text-sm">
                Déjà un compte?{" "}
                <Link
                  to={ROUTES.LOGIN}
                  className="client-theme-text-primary font-semibold"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          {selectedStyle === "style1" && <div className="hidden md:block border-l border-slate-500/30"></div>}
        </div>
      </div>
    </div>
  );
}

export default InscriptionForm;
