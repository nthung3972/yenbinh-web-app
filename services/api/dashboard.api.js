import apiService from "@/services/api.service";

export const DashboardApi = {
    getStatsBuildings() {
        return apiService.get("/dashboard/overview");
    },

    getStatsBuilding(id) {
        return apiService.get(`/dashboard/stats/${id}`);
    }
};
