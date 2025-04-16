import apiService from "@/services/api.service";

export const ApartmentApi = {
    getListByBuilding(building_id, page, per_page, keyword, apartment_type, status) {
        return apiService.get(`/apartment/list-by-building/${building_id}?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}&apartment_type=${apartment_type}&status=${status}`);
    },

    create(data) {
        return apiService.post('/apartment/create', data);
    },

    edit($apartment_id) {
        return apiService.get(`/apartment/apartment/${$apartment_id}/edit`);
    },

    update($apartment_id, data) {
        return apiService.post(`/apartment/apartment/${$apartment_id}/update`, data);
    },

    getCodeApartments($id) {
        return apiService.get(`/apartment/apartment-numbers/${$id}`);
    },

    getResidentsByApartment(code) {
        return apiService.get(`/apartment/apartment-number/${code}/residents`);
    }
};
