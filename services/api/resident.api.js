import apiService from "@/services/api.service";

export const ResidentApi = {
    getListResident(building_id, page, per_page, keyword) {
        return apiService.get(`/resident/resident-list/${building_id}?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}`);
    },

    create(data) {
        return apiService.post('/resident/create', data);
    },

    edit($resident_id) {
        return apiService.get(`/resident/resident/${$resident_id}/edit`);
    },

    addResidentToApartment(data, $resident_id) {
        return apiService.post(`/resident/${$resident_id}/add-apartment`, data);
    },

    deleteResidentToApartment(data, $resident_id) {
        return apiService.post(`/resident/${$resident_id}/delete-apartment`, data);
    },

    update(data, $resident_id) {
        return apiService.post(`/resident/update/${$resident_id}`, data);
    }
};
