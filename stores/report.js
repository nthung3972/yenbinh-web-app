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
        },

        async createDailyReports(data)  {
            this.loading = true
            try {
                const response = await ReportApi.dailyReports(data)
                if (response.data) {
                    this.error = null
                    return response
                }
            } catch (error) {
                this.error = error
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
