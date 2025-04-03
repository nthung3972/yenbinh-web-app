import apiService from "@/services/api.service";

export const BuildingApi = {
    getListBuilding(page = 1, per_page = 5, keyword = '') {
        return apiService.get(`/building/building-list?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}`);
    },

    create(data) {
        return apiService.post('/building/create', data);
    },

    edit($id) {
        return apiService.get(`/building/edit/${$id}`);
    },

    update($id, data) {
        return apiService.put(`/building/update/${$id}`, data);
    },

    delete($id) {
        return apiService.delete(`/building/delete/${$id}`);
    },
};
