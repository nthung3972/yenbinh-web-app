import apiService from "@/services/api.service";

export const buildingPersonnelApi = {
    getListByBuilding(building_id, page, per_page, keyword, position, status) {
        return apiService.get(`/building-personnel/list-by-building/${building_id}?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}&position=${position}&status=${status}`);
    },

    create(data) {
        return apiService.post('/building-personnel/create', data)
    },

    edit($id) {
        return apiService.get(`/building-personnel/edit/${$id}`);
    },

    update($id, data) {
        return apiService.put(`/building-personnel/update/${$id}`, data);
    },
};
