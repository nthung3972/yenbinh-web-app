import apiService from "@/services/api.service";

export const FeeSubtypeApi = {
    createFeeSubtype(data) {
        return apiService.post('/fees/subtypes', data);
    },

    updateFeeSubtype(id, data) {
        return apiService.put(`/fees/subtypes/${id}`, data);
    },

    getByFeeTypeId(id) {
        return apiService.get(`/fees/subtypes/${id}`);
    }
}