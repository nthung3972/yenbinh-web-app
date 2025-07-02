import apiService from "@/services/api.service";

export const PaymentApi = {
    create(data) {
        return apiService.post('/payment/mass-payment', data)
    }
};
