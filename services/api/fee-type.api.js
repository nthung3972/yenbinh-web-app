import apiService from "@/services/api.service";

export const FeeTypeApi = {
    getFeeTypes() {
        return apiService.get('/fees/types');
    },

    createFeeType(data) {
        return apiService.post('/fees/types', data);
    },

    updateFeeType(id, data) {
        return apiService.put(`/fees/types/${id}`, data);
    }
}