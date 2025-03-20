import apiService from "@/services/api.service";

export const DashboardApi = {
    getCollectionRate() {
        return apiService.get("/dashboard/collection-rate");
    },
};
