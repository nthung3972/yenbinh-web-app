import apiService from "@/services/api.service";

export const ResidentApi = {
    getListResident(building_id, page = 1, per_page = 5, keyword = '') {
        return apiService.get(`/resident/resident-list/${building_id}?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}`);
    },

    create(data) {
        return apiService.post('/resident/create', data);
    },

    edit($resident_id) {
        return apiService.get(`/resident/resident/${$resident_id}/edit`);
    },

    // update($apartment_id, data) {
    //     return apiService.post(`/apartment/apartment/${$apartment_id}/update`, data);
    // }
};
