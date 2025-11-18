import { defineStore } from "pinia";
import { AdjustmentInvoice } from "~/services/api/adjustment-invoice.api";

export const useAdjustmentInvoiceStore = defineStore("adjustment-invoice", {
    state: () => ({
        adjustmentInvoice: {},
        adjustmentInvoices: [],
        loading: false,
        error: null,
        pagination: {
            current_page: 1,
            per_page: '',
            total: 0,
            last_page: 1,
        },
    }),

    actions: {
        async create(data) {
            this.loading = true;
            try {
                const response = await AdjustmentInvoice.create(data);
                if (response.data.data) {
                    return response.data.data.path
                }
            } catch (error) {
                this.error = error.message || 'Failed to fetch debt history';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
    }
});
