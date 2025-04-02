import apiService from "@/services/api.service";

export const BuildingApi = {
    getListBuilding(page = 1, per_page = 5, keyword = '') {
        return apiService.get(`/building/building-list?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}`);
    },

    // getStatsBuilding(id) {
    //     return apiService.get(`/dashboard/stats/${id}`);
    // }
};
