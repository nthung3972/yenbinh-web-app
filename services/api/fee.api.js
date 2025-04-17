import apiService from "@/services/api.service";

export const FeeApi = {
    getFlexibleFee() {
        return apiService.get('/fee-type/flexible')
    }
};
