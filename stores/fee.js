import { defineStore } from "pinia";
import { FeeApi } from "~/services/api/fee.api";

export const useFeeStore = defineStore("fee", {
    state: () => ({
        loading: false,
        error: null,
    }),

    actions: {
        async getFlexibleFee() {
            this.loading = true
            try {
                const response = await FeeApi.getFlexibleFee();
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
