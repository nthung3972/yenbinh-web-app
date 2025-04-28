import apiService from "@/services/api.service";

export const StaffApi = {
    getListStaff(page = 1, per_page = 5, keyword = '') {
        return apiService.get(`/staff/staff-list?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}`);
    },

    create(data) {
        return apiService.post('/staff/create-staff', data);
    },

    detail($id) {
        return apiService.get(`/staff/staff-detail/${$id}`);
    },

    delete($id) {
        return apiService.delete(`/staff/delete-staff/${$id}`);
    },
};
