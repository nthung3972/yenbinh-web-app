import apiService from "@/services/api.service";

export const ApartmentApi = {
    getListByBuilding(id) {
        return apiService.get(`/apartment/list-by-building/${id}`);
    }
};
