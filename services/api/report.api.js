import apiService from "@/services/api.service";

export const ReportApi = {
    //staff report
    formInfo(id) {
        return apiService.get(`/report/form-info/${id}`)
    },

    dailyReports(data) {
        return apiService.post('/report/daily-reports', data)
    },

    getReportsByStaff(report_date_from, report_date_to, status, page = 1, per_page = 10) {
        return apiService.get(`/report/daily-reports-by-staff?report_date_from=${report_date_from}&report_date_to=${report_date_to}&status=${status}&page=${page}&per_page=${per_page}`)
    },

    dailyrReportByStaff(id) {
        return apiService.get(`/report/daily-report/${id}`)
    },

    updateDailyReport(id, data) {
        return apiService.put(`/report/update-daily-report/${id}`, data)
    },

    //admin report
    allDailyReports(building_id, status, report_date_from, report_date_to, page = 1, per_page = 10) {
        return apiService.get(`/admin-report/daily-reports?building_id=${building_id}&status=${status}&report_date_from=${report_date_from}&report_date_to=${report_date_to}&page=${page}&per_page=${per_page}`)
    },

    dailyReportDetail(id) {
        return apiService.get(`/admin-report/daily-report/${id}`)
    },

    deleteDailyReport(id) {
        return apiService.delete(`/admin-report/delete-daily-report/${id}`)
    }
};
