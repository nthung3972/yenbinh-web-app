import apiService from "@/services/api.service";

export const BuildingApi = {
    getOverview() {
        return apiService.get("/building/overview");
    },

    getStatsBuilding(id) {
        return apiService.get(`/dashboard/stats/${id}`);
    }
};
