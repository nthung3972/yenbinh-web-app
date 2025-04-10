import { defineStore } from "pinia";
import { UploadApi } from "~/services/api/upload.api";

export const useUploadStore = defineStore("upload", {
    state: () => ({
        url: null
    }),

    actions: {
        async uploadImage(formData) {
            this.loading = true;
            try {
                const response = await UploadApi.uploadImage(formData);
                if(response.data) {
                    return response.data.data
                }
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        }
    },
});
