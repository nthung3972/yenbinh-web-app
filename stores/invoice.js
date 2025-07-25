import { defineStore } from "pinia";
import { InvoiceApi } from "~/services/api/invoice.api";
import { useDashboardStore } from '@/stores/dashboard';

export const useInvoiceStore = defineStore("invoice", {
    state: () => ({
        invoiceList: [],
        invoice: [],
        pagination: {
            current_page: 1,
            per_page: '',
            total: 0,
            last_page: 1,
        },
        keyword: '',
        loading: false,
        error: null,
    }),

    actions: {
        async fetchtInvoiceList(page = 1, perPage = '', keyword = '', status ='', invoice_date_from, invoice_date_to) {
            const dashboardStore = useDashboardStore();
            const building_id = dashboardStore.getSelectedBuildingId;

            this.loading = true;
            try {
                const response = await InvoiceApi.getListInvoice(building_id, page, perPage, keyword, status, invoice_date_from, invoice_date_to);
                if (response.data) {
                    this.invoiceList = response.data.data.data.data;

                    this.pagination = {
                        current_page: response.data.data.data.current_page,
                        per_page: response.data.data.data.per_page,
                        total: response.data.data.data.total,
                        last_page: response.data.data.data.last_page,
                    };
                    this.error = null;
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách overview:", error);
                this.error = "Đã xảy ra lỗi khi tải dữ liệu hóa đơn!";
            } finally {
                this.loading = false;
            }
        },

        async createInvoice(data) {
            this.loading = true;
            try {
                const response = await InvoiceApi.createInvoice(data);
                if (response.data) {
                    this.error = null
                    return response.data
                }
            } catch (error) {
                if (error.data) {
                    this.error = error.data.general[0]
                }
                throw error
            } finally {
                this.loading = false;
            }
        },

        async fetchInvoice(id) {
            this.loading = true
            try {
                const response = await InvoiceApi.showInvoice(id);
                if (response.data) {
                    this.invoice = response.data.data.data
                    return this.invoice
                }
            } catch (error) {
                throw error
            } finally {
                this.loading = false;
            }
        },

        async updateInvoice(id, data) {
            this.loading = true
            try {
                const response = await InvoiceApi.updateInvoice(id,data);
                if (response.data) {
                    return response.data
                }
            } catch (error) {
                throw error
            } finally {
                this.loading = false;
            }
        },

        async getApartmentFees(id) {
            this.loading = true
            this.error = null
            try {
                const response = await InvoiceApi.getApartmentFees(id);
                if (response.data) {
                    return response.data
                }
            } catch (error) {
                throw error
            } finally {
                this.loading = false;
            }
        },

        async deleteInvoice(id) {   
            this.loading = true
            try {
                const response = await InvoiceApi.deleteInvoice(id);
                if (response.data.data) {
                    return response.data.data
                }
            } catch (error) {
                throw error
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
    }
});
