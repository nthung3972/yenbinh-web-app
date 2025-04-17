import apiService from "@/services/api.service";

export const VehicleTypeApi = {
    getList() {
        return apiService.get('/vehicle-type/list');
    },
};
