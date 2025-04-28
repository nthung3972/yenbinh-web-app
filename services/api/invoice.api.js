import apiService from "@/services/api.service";

export const InvoiceApi = {
    getListInvoice(building_id, page, per_page, keyword, status, invoice_date_from, invoice_date_to) {
        return apiService.get(`/invoice/list-by-building/${building_id}?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}&status=${status}&invoice_date_form=${invoice_date_from}&invoice_date_to=${invoice_date_to}`);
    },

    createInvoice(data) {
        return apiService.post('/invoice/create', data);
    },

    showInvoice($id) {
        return apiService.get(`/invoice/edit/${$id}`);
    },

    updateInvoice($id, data) {
        return apiService.post(`/invoice/update/${$id}`, data);
    },

    getApartmentFees($id) {
        return apiService.get(`/invoice/apartment-fees/${$id}`);
    },

    deleteInvoice($id) {
        return apiService.delete(`/invoice/delete/${$id}`);
    },
};
