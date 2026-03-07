import { API_CONFIG, API_PATHS } from "../../utils/constants";

export interface UploadFileResult {
  fileName: string;
  url: string;
  size: number;
  type: string;
}

const uploadService = {
  async fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        resolve(typeof result === "string" ? result : "");
      };
      reader.onerror = () => reject(new Error("Impossible de lire le fichier"));
      reader.readAsDataURL(file);
    });
  },

  resolveImageUrl(filename: string): string {
    if (!filename) {
      return "";
    }
    if (filename.startsWith("http://") || filename.startsWith("https://") || filename.startsWith("data:")) {
      return filename;
    }

    const base = API_CONFIG.BASE_URL.replace(/\/$/, "");

    // Handles values like '/uploads/x.jpg' or '/images/x.jpg'.
    if (filename.startsWith("/")) {
      return `${base}${filename}`;
    }

    // Handles values like 'uploads/x.jpg' already containing path.
    if (filename.startsWith("uploads/")) {
      return `${base}/${filename}`;
    }

    return `${base}${API_PATHS.UPLOADS.GET_IMAGE(filename)}`;
  },

  async describeFile(file: File): Promise<UploadFileResult> {
    return {
      fileName: file.name,
      size: file.size,
      type: file.type,
      url: await this.fileToDataUrl(file),
    };
  },
};

export default uploadService;
