import { useEffect, useState } from "react";
import { FiSettings } from "react-icons/fi";
import { toast } from "react-toastify";

import AuthenticatedContent from "../../components/AuthenticatedContent";
import PageHeader from "../../components/PageHeader";
import useAuth from "../../../../shared/hooks/auth";
import useUser from "../../../../shared/hooks/user";
import uploadService from "../../../../shared/services/upload";
import {
  CLIENT_THEMES,
  applyClientTheme,
  getStoredClientThemeId,
  type ClientThemeId,
} from "../../../../shared/utils";

function ParametresPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const { enhancedUser, updateProfile, loading: dashboardLoading } = useUser();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [profileImageUrlInput, setProfileImageUrlInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ClientThemeId>(() => getStoredClientThemeId());

  const displayName = [enhancedUser?.name ?? user?.name ?? "", enhancedUser?.surname ?? user?.surname ?? ""]
    .join(" ")
    .trim();

  useEffect(() => {
    const imageValue = enhancedUser?.profileImageUrl ?? user?.profileImageUrl ?? "";
    setName(enhancedUser?.name ?? user?.name ?? "");
    setSurname(enhancedUser?.surname ?? user?.surname ?? "");
    setProfileImageUrl(imageValue);
    setProfileImageUrlInput(imageValue.startsWith("data:image/") ? "" : imageValue);
  }, [enhancedUser, user]);

  const previewImage = profileImageUrl ? uploadService.resolveImageUrl(profileImageUrl) : "";

  const handleThemeChange = (themeId: ClientThemeId) => {
    setSelectedTheme(themeId);
    applyClientTheme(themeId);
    toast.success("Theme applique a toutes les pages client.");
  };

  const handlePickImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez choisir un fichier image.");
      return;
    }

    try {
      const dataUrl = await uploadService.fileToDataUrl(file);
      setProfileImageUrl(dataUrl);
      toast.success("Image chargee. N'oubliez pas d'enregistrer.");
    } catch {
      toast.error("Impossible de lire l'image selectionnee.");
    }
  };

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !surname.trim()) {
      toast.error("Le nom et le prenom sont obligatoires.");
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile({
        name: name.trim(),
        surname: surname.trim(),
        profileImageUrl: profileImageUrl.trim() || undefined,
      });
      toast.success("Profil mis a jour avec succes.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur de mise a jour du profil";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthenticatedContent isLoading={loading || dashboardLoading} isAuthenticated={isAuthenticated}>
      <section className="space-y-6">
        <PageHeader
          title="Parametres"
          subtitle={`Bienvenue, ${displayName}`.trim()}
          icon={FiSettings}
        />

        <form
          onSubmit={handleSaveProfile}
          className="backdrop-blur-xl rounded-lg p-6 border client-theme-card client-theme-text-primary space-y-5"
        >
          <h3 className="text-base font-semibold client-theme-text-primary">Modifier mon profil</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg border client-theme-card-soft p-4 space-y-2">
              <label htmlFor="name" className="text-sm client-theme-label">Nom</label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none client-theme-input"
                placeholder="Votre nom"
              />
            </div>

            <div className="rounded-lg border client-theme-card-soft p-4 space-y-2">
              <label htmlFor="surname" className="text-sm client-theme-label">Prenom</label>
              <input
                id="surname"
                value={surname}
                onChange={(event) => setSurname(event.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none client-theme-input"
                placeholder="Votre prenom"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg border client-theme-card-soft p-4 space-y-2">
              <label htmlFor="profileImageUrl" className="text-sm client-theme-label">Image profil (URL)</label>
              <input
                id="profileImageUrl"
                value={profileImageUrlInput}
                onChange={(event) => setProfileImageUrlInput(event.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none client-theme-input"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={() => {
                  const cleanUrl = profileImageUrlInput.trim();
                  if (!cleanUrl) {
                    return;
                  }
                  setProfileImageUrl(cleanUrl);
                  toast.success("URL image appliquee. N'oubliez pas d'enregistrer.");
                }}
                className="inline-flex mr-4 items-center rounded-lg border px-3 py-2 text-sm client-theme-outline-button"
              >
                Utiliser cette URL
              </button>
              <label
                htmlFor="profileImageFile"
                className="inline-flex items-center rounded-lg border px-3 py-2 text-sm cursor-pointer client-theme-button"
              >
                Choisir une image depuis mon appareil
              </label>
              <input
                id="profileImageFile"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePickImage}
              />
            </div>

            <div className="rounded-lg border client-theme-card-soft p-4 space-y-2">
              <p className="text-sm client-theme-label">Apercu de votre profil</p>
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Apercu profil"
                  className="h-32 w-32 rounded-full border object-cover client-surface"
                />
              ) : (
                <div className="h-32 w-32 rounded-full border client-theme-card-soft flex items-center justify-center text-xs client-theme-text-secondary">
                  Aucune image
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border client-theme-card-soft p-4">
            <p className="text-sm client-theme-text-secondary">Email: {enhancedUser?.email ?? user?.email ?? "-"}</p>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-50 client-theme-button"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>

          <div className="rounded-lg border client-theme-card-soft p-4 space-y-3">
            <h4 className="client-theme-text-primary font-semibold">Couleur du theme</h4>
            <p className="text-sm client-theme-text-secondary">
              Choisissez un style de couleur pour tout l'espace client.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CLIENT_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleThemeChange(theme.id)}
                  className={`rounded-lg border p-3 text-left transition-all client-theme-preview-${theme.id} ${selectedTheme === theme.id ? "border-white/70" : "client-theme-chip"}`}
                >
                  <p className="text-sm font-semibold text-white">{theme.label}</p>
                </button>
              ))}
            </div>
          </div>
        </form>
      </section>
    </AuthenticatedContent>
  );
}

export default ParametresPage;
