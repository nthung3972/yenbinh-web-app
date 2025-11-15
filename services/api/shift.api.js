import apiService from "@/services/api.service";

export const ShiftApi = {
    getShifts(page, per_page, keyword, buildingId) {
        return apiService.get(`/shift/shifts?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}&buildingId=${buildingId}`);
    },

    create(data) {
        return apiService.post('/shift/create', data);
    }, 

    edit(shiftId) {
        return apiService.get(`/shift/shift/${shiftId}`);
    },

    update(shiftId, data) {
        return apiService.put(`/shift/update/${shiftId}`, data);
    }
}