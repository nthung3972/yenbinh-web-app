import { defineStore } from "pinia";
import { ReportApi } from "~/services/api/report.api";

export const useReportStore = defineStore("report", {
    state: () => ({
        dailyReports: [],
        pagination: {
            current_page: 1,
            per_page: '',
            total: 0,
            last_page: 1,
        },
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
        },

        async getReportsByStaff(report_date_from, report_date_to, page = 1, per_page = 10) {
            this.loading = true
            try {
                const response = await ReportApi.getReportsByStaff(report_date_from, report_date_to, page, per_page)
                if(response.data) {
                    this.dailyReports = response.data.data
                    this.pagination = {
                        current_page: response.data.current_page,
                        per_page: response.data.per_page,
                        total: response.data.total,
                        last_page: response.data.last_page,
                    };
                    this.error = null
                }
            } catch (error) {
                this.error = error
                throw error
            } finally {
                this.loading = false
            }
        }
    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
    }
});
