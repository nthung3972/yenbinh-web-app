import apiService from "@/services/api.service";

export const VehicleApi = {
    getListVehicle(building_id, page = 1, per_page = 5, keyword = '', vehicle_type = '', status) {
        return apiService.get(`/vehicle/list-by-building/${building_id}?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}&vehicle_type=${encodeURIComponent(vehicle_type)}&status=${status}`);
    },

    create(data) {
        return apiService.post('/vehicle/create', data);
    },

    edit($vehicle_id) {
        return apiService.get(`/vehicle/edit/${$vehicle_id}`);
    },

    update(data, $vehicle_id) {
        return apiService.post(`/vehicle/update/${$vehicle_id}`, data);
    },

    delete($vehicle_id) {
        return apiService.delete(`/vehicle/delete/${$vehicle_id}`);
    },
};
