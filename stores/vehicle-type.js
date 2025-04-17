import { defineStore } from "pinia";
import { VehicleTypeApi } from "~/services/api/vehicle-type.api";

export const useVeicleTypeStore = defineStore("vehicle-type", {
    state: () => ({
        loading: false,
        error: null,
    }),

    actions: {
        async getList() {
            this.loading = true
            try {
                const response = await VehicleTypeApi.getList()
                if (response.data) {
                    return response.data
                }
            } catch (error) {
                throw error
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
    }
});
