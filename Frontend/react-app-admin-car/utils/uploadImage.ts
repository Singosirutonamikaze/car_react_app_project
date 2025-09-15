import axiosInstance from "../service/axiosInstance";
import { API_PATHS } from "./apiPath";

class UploadImage {
    static async uploadImage(imageFile: File) {
        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const response = await axiosInstance.post(API_PATHS.UPLOADS.GET_IMAGE("image"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    }
}

export default UploadImage;