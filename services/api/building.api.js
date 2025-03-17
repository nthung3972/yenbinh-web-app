import apiService from "@/services/api.service";

export const BuildingApi = {
    getBuildings(params = null) {
        return apiService.get("/building/building-list", params);
    },
};
