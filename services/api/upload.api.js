import apiService from "@/services/api.service";

export const UploadApi = {
    uploadImage(formData) {
        return apiService.post('/upload/upload-image', formData);
    }
};
