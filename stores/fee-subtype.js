import { defineStore } from "pinia";
import { FeeSubtypeApi } from "~/services/api/fee-subtype.api";

export const useFeeSubtypeStore = defineStore("fee-subtype", {
    state: () => ({
        feeSubtypes: [],
        feeSubtypesById: [],
        feeSubtype: {},
        loading: false,
        error: null,
    }),

    actions: {
        async createFeeSubtype(data) {
            this.loading = true;
            try {
                const response = await FeeSubtypeApi.createFeeSubtype(data);
                return response.data
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi tạo loại phí";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateFeeSubtype(id, data) {
            this.loading = true;
            try {
                const response = await FeeSubtypeApi.updateFeeSubtype(id, data);
                return response.data
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi cập nhật loại phí";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getByFeeTypeId(id) {
            try {
                const response = await FeeSubtypeApi.getByFeeTypeId(id);
                if (response) {
                    this.feeSubtypesById = response.data.data.data
                }
                return response.data
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi cập nhật loại phí";
                throw error;
            }
        }
    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error,
    }
});
