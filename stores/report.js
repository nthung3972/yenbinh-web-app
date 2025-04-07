import { defineStore } from "pinia";
import { ReportApi } from "~/services/api/report.api";

export const useReportStore = defineStore("report", {
    state: () => ({
        loading: false,
        error: null,
        formInfo: null
    }),

    actions: {
        async getFormInfo(id) {
            this.loading = true;
            this.error = null;
            try {
                const response = await ReportApi.formInfo(id);
                if (response.data) {
                    this.formInfo = response.data;
                    this.loading = false;
                    return response.data;
                }
            } catch (error) {
                throw error;
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
