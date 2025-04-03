import apiService from "@/services/api.service";

export const ApartmentApi = {
    getListByBuilding(building_id, page = 1, per_page = 5, keyword = '') {
        return apiService.get(`/apartment/list-by-building/${building_id}?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}`);
    },

    create(data) {
        return apiService.post('/apartment/create', data);
    },

    edit($apartment_id) {
        return apiService.get(`/apartment/apartment/${$apartment_id}/edit`);
    },

    update($apartment_id, data) {
        return apiService.post(`/apartment/apartment/${$apartment_id}/update`, data);
    }
};
