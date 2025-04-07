import apiService from "@/services/api.service";

export const ReportApi = {
    formInfo(id) {
        return apiService.get(`/report/form-info/${id}`)
    },

    dailyReports(data) {
        return apiService.post('/report/daily-reports', data)
    }
};
