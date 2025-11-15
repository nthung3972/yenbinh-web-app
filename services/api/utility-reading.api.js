import apiService from "@/services/api.service";

export const UtilityReadingApi = {
    getList(building_id, page, per_page, period, utility_type, status) {
        return apiService.get(`/utilities/by-building/${building_id}?page=${page}&per_page=${per_page}&status=${status}&period=${period}&utility_type=${utility_type}`);
    },

    calculateAndBill(data) {
        return apiService.post('/utilities/calculate-and-bill', data);
    }, 

    // edit(shiftId) {
    //     return apiService.get(`/shift/shift/${shiftId}`);
    // },

    // update(shiftId, data) {
    //     return apiService.put(`/shift/update/${shiftId}`, data);
    // }
}
