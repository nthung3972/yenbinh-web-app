import apiService from "@/services/api.service";

export const ApartmentApi = {
    getListByBuilding(building_id, page = 1, per_page = 5, keyword = '') {
        return apiService.get(`/apartment/list-by-building/${building_id}?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}`);
    },

    create(data) {
        return apiService.post('/apartment/create', data);
    }
};
