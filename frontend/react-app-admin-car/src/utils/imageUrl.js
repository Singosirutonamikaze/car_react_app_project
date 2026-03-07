import { API_BASE_URL } from "./apiPath";

export const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024;

export function resolveImageUrl(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("blob:")) {
    return "";
  }

  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith("/")) {
    return `${API_BASE_URL}${trimmed}`;
  }

  if (trimmed.startsWith("uploads/")) {
    return `${API_BASE_URL}/${trimmed}`;
  }

  return `${API_BASE_URL}/uploads/${trimmed}`;
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      reject(new Error("Image trop lourde. Taille maximale autorisee: 1 Mo."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Impossible de lire le fichier image."));
    reader.readAsDataURL(file);
  });
}
