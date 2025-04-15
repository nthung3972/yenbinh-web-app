import apiService from "@/services/api.service";

export const ApartmentApi = {
    getListByBuilding(building_id, page, per_page, keyword, status, apartment_type) {
        return apiService.get(`/apartment/list-by-building/${building_id}?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}&status=${status}&apartment_type=${apartment_type}`);
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
