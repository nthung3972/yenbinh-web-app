import { defineStore } from "pinia";
import { PaymentApi } from "~/services/api/payment.api";

export const usePaymentStore = defineStore("payment", {
    state: () => ({
        loading: false,
        error: null,
        payments: [],
        selectedInvoice: null
    }),

    actions: {
        async createPayment(data) {
            this.loading = true
            try {
                const response = await PaymentApi.create(data);
                if (response.data) {
                    return response.data
                }
            } catch (error) {
                throw error
            } finally {
                this.loading = false;
            }
        },

        setSelectedInvoice(invoice) {
            this.selectedInvoice = invoice
            this.error = null
        },

        clearSelectedInvoice() {
            this.selectedInvoice = invoice
            this.error = null
        }
    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
    }
});
