import apiService from "@/services/api.service";

export const BuildingFeeApi = {
    getBuildingFees(building_id, page, per_page, keyword, fee_types_id) {
        return apiService.get(`/building-fee/fees-by-building/${building_id}?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}&fee_types_id=${fee_types_id}`);
    },

    getBuildingFee(id) {
        return apiService.get(`building-fee/fee/${id}`)
    },
 
    createBuildingFee(data) {
        return apiService.post('/building-fee/fee', data);
    },

    updateBuildingFee(id, data) {
        return apiService.put(`/building-fee/fee/${id}`, data);
    }
}