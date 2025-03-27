import apiService from "@/services/api.service";

export const InvoiceApi = {
    getListInvoice(building_id, page = 1, per_page = 5, keyword = '') {
        return apiService.get(`/invoice/list-by-building/${building_id}?page=${page}&per_page=${per_page}&keyword=${encodeURIComponent(keyword)}`);
    },
};
