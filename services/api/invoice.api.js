import apiService from "@/services/api.service";

export const InvoiceApi = {
    getListInvoice(building_id, page, per_page, keyword, status, period ) {
        return apiService.get(`/invoice/list-by-building/${building_id}?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}&status=${status}&period=${period}`);
    },

    showInvoice($id) {
        return apiService.get(`/invoice/edit/${$id}`);
    },

    getApartmentFees($id) {
        return apiService.get(`/invoice/apartment-fees/${$id}`);
    },

    deleteInvoice($id) {
        return apiService.delete(`/invoice/delete/${$id}`);
    },

    generateInvoices(data) {
        return apiService.post('/invoice/generate', data)
    }
};
