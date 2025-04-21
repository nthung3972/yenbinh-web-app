import apiService from "@/services/api.service";

export const DebtApi = {
    fetchDebts(page, perPage, building_id, period_type, period_value, status) {
        return apiService.get(`/debt?page=${page}&per_page=${perPage}&building_id=${building_id}&period_type=${encodeURIComponent(period_type)}&period_value=${encodeURIComponent(period_value)}&status=${status}`)
    },

    fetchDebtHistory(period_type, period_value, status) {
        return apiService.get(`/debt/history?period_type=${encodeURIComponent(period_type)}&period_value=${encodeURIComponent(period_value)}&status=${status}`);
    },

    fetchPeriods() {
        return apiService.get('/debt/periods')
    }
};
