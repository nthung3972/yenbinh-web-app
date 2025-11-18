import apiService from "@/services/api.service";

export const AdjustmentInvoice = {
    create(data) {
        return apiService.post('/invoice-adjustment/create', data);
    }
};
