import { defineStore } from "pinia";
import { UploadApi } from "~/services/api/upload.api";

export const useUploadStore = defineStore("upload", {
    state: () => ({
        url: null
        // vehicleList: [],
        // vehicle: [],
        // pagination: {
        //     current_page: 1,
        //     per_page: '',
        //     total: 0,
        //     last_page: 1,
        // },
        // keyword: '',
        // vehicle_type: '',
        // loading: false,
        // error: null,
    }),

    actions: {
        async uploadImage(formData) {
            this.loading = true;
            try {
                const response = await UploadApi.uploadImage(formData);
                if(response.data) {
                    console.log('response', response.data.path);
                    return response.data
                }
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        }
    },

    // getters: {
    //     isLoading: (state) => state.loading,
    //     hasError: (state) => state.error
    // }
});
