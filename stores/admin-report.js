import { defineStore } from "pinia";
import { ReportApi } from "~/services/api/report.api";

export const useAdminReportStore = defineStore("admin-report", {
    state: () => ({
        dailyReports: [],
        dailyReportsCount: 0,
        pagination: {
            current_page: 1,
            per_page: '',
            total: 0,
            last_page: 1,
        },
        loading: false,
        error: null
    }),

    actions: {
        async getDailyReports(building_id, status, report_date_from, report_date_to, page = 1, per_page = 10) {
            this.loading = true;
            try {
                const response = await ReportApi.allDailyReports(building_id, status, report_date_from, report_date_to, page, per_page);
                console.log("response", response.data);
                if (response.data) {
                    this.dailyReports = response.data.data;
                    this.dailyReportsCount = response.data.total;
                    this.pagination = {
                        current_page: response.data.current_page,
                        per_page: response.data.per_page,
                        total: response.data.total,
                        last_page: response.data.last_page,
                    };
                    this.error = null;
                }
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async dailyReportDetail(id) {
            this.loading = true
            try {
                const response = await ReportApi.dailyReportDetail(id)
                if(response.data) {
                    return response.data
                }
                this.error = null
            } catch (error) {
                console.log('error', error)
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteDailyReport(id) {
            this.loading = true
            try {
                const response = await ReportApi.deleteDailyReport(id)
                if (response.data) {
                    this.dailyReports = this.dailyReports.filter(report => report.report_id !== id);
                    return response.data;
                }
                this.error = null;
            } catch (error) {
                console.log('error', error)
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
