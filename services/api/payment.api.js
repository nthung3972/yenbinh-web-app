import apiService from "@/services/api.service";

export const PaymentApi = {
    create(data) {
        return apiService.post('/payment/create', data)
    },

    getHistoryByApartment(id) {
        return apiService.get(`/payment/history-by-apartment/${id}`)
    }
};
