import { defineStore } from "pinia";
import { UtilityReadingApi } from "~/services/api/utility-reading.api";

export const useUtilityReadingStore = defineStore("utility-reading", {
    state: () => ({
        utilities: [],
        pagination: {
            current_page: 1,
            per_page: '',
            total: 0,
            last_page: 1,
        },
        loading: false,
        error: null,
    }),

    actions: {
        async getList(building_id, page, per_page, period, utility_type, status) {
            this.loading = true
            try {
                const response = await UtilityReadingApi.getList(building_id, page, per_page, period, utility_type, status)
                if (response.data) {
                    this.utilities = response.data.data.data
                    this.pagination = {
                        current_page: response.data.data.current_page,
                        per_page: response.data.data.per_page,
                        total: response.data.data.total,
                        last_page: response.data.data.last_page,
                    };
                }
            } catch (error) {
                throw error
            } finally {
                this.loading = false;
            }
        },

        async calculateAndBill(data) {
            try {
                const response = await UtilityReadingApi.calculateAndBill(data)
                if (response) {
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
