export type ClientThemeId = "ocean" | "emerald" | "sunset" | "graphite";

export interface ClientThemePalette {
  id: ClientThemeId;
  label: string;
  bgFrom: string;
  bgVia: string;
  bgTo: string;
  surface: string;
  surfaceStrong: string;
  border: string;
  accent: string;
  accentStrong: string;
  textPrimary: string;
  textSecondary: string;
}

export const CLIENT_THEME_STORAGE_KEY = "client-dashboard-theme";

export const CLIENT_THEMES: ClientThemePalette[] = [
  {
    id: "ocean",
    label: "Bleu initial",
    bgFrom: "#1d4ed8",
    bgVia: "#1d4ed8",
    bgTo: "#1d4ed8",
    surface: "rgba(30, 64, 175, 0.45)",
    surfaceStrong: "rgba(30, 64, 175, 0.72)",
    border: "rgba(103, 232, 249, 0.24)",
    accent: "rgba(8, 145, 178, 0.45)",
    accentStrong: "rgba(6, 182, 212, 0.9)",
    textPrimary: "#eff6ff",
    textSecondary: "rgba(219, 234, 254, 0.86)",
  },
  {
    id: "emerald",
    label: "Emerald",
    bgFrom: "#052e16",
    bgVia: "#065f46",
    bgTo: "#064e3b",
    surface: "rgba(6, 78, 59, 0.45)",
    surfaceStrong: "rgba(6, 78, 59, 0.72)",
    border: "rgba(110, 231, 183, 0.26)",
    accent: "rgba(16, 185, 129, 0.35)",
    accentStrong: "rgba(16, 185, 129, 0.92)",
    textPrimary: "#ecfdf5",
    textSecondary: "rgba(209, 250, 229, 0.88)",
  },
  {
    id: "sunset",
    label: "Sunset",
    bgFrom: "#7c2d12",
    bgVia: "#9a3412",
    bgTo: "#7f1d1d",
    surface: "rgba(124, 45, 18, 0.42)",
    surfaceStrong: "rgba(127, 29, 29, 0.75)",
    border: "rgba(253, 186, 116, 0.28)",
    accent: "rgba(251, 146, 60, 0.35)",
    accentStrong: "rgba(249, 115, 22, 0.92)",
    textPrimary: "#fff7ed",
    textSecondary: "rgba(255, 237, 213, 0.9)",
  },
  {
    id: "graphite",
    label: "Graphite",
    bgFrom: "#111827",
    bgVia: "#1f2937",
    bgTo: "#0b1120",
    surface: "rgba(17, 24, 39, 0.45)",
    surfaceStrong: "rgba(17, 24, 39, 0.78)",
    border: "rgba(156, 163, 175, 0.27)",
    accent: "rgba(107, 114, 128, 0.35)",
    accentStrong: "rgba(75, 85, 99, 0.95)",
    textPrimary: "#f9fafb",
    textSecondary: "rgba(229, 231, 235, 0.86)",
  },
];

export function getClientThemeById(themeId: string | null | undefined): ClientThemePalette {
  return CLIENT_THEMES.find((theme) => theme.id === themeId) ?? CLIENT_THEMES[0];
}

export function getStoredClientThemeId(): ClientThemeId {
  const value = globalThis.localStorage?.getItem(CLIENT_THEME_STORAGE_KEY);
  return getClientThemeById(value).id;
}

export function applyClientTheme(themeId: ClientThemeId): void {
  const theme = getClientThemeById(themeId);
  const root = document.documentElement;

  root.style.setProperty("--client-bg-from", theme.bgFrom);
  root.style.setProperty("--client-bg-via", theme.bgVia);
  root.style.setProperty("--client-bg-to", theme.bgTo);
  root.style.setProperty("--client-surface", theme.surface);
  root.style.setProperty("--client-surface-strong", theme.surfaceStrong);
  root.style.setProperty("--client-border", theme.border);
  root.style.setProperty("--client-accent", theme.accent);
  root.style.setProperty("--client-accent-strong", theme.accentStrong);
  root.style.setProperty("--client-text-primary", theme.textPrimary);
  root.style.setProperty("--client-text-secondary", theme.textSecondary);

  globalThis.localStorage?.setItem(CLIENT_THEME_STORAGE_KEY, theme.id);
}

export function applyStoredClientTheme(): ClientThemeId {
  const themeId = getStoredClientThemeId();
  applyClientTheme(themeId);
  return themeId;
}
