import { defineStore } from "pinia";
import { FeeTypeApi } from "~/services/api/fee-type.api";
import { FeeSubtypeApi } from "~/services/api/fee-subtype.api";

export const useFeeTypeStore = defineStore("fee-type", {
    state: () => ({
        feeTypes: [],
        feeType: {},
        feeSubtypes: [],
        loading: false,
        error: null,
    }),

    actions: {
        async getFeeTypes() {
            this.loading = true;
            try {
                if (this.feeTypes.length > 0) return
                const response = await FeeTypeApi.getFeeTypes();
                if (response) {
                    this.feeTypes = response.data.data.data;
                }
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi tải danh sách phí!";
            } finally {
                this.loading = false;
            }
        },

        async fetchFeeSubtypes(feeTypeId) {
            try {
                this.feeSubtypes = []
                if (!feeTypeId) return
                const response = await FeeSubtypeApi.getByFeeTypeId(feeTypeId)
                if (response) {
                    this.feeSubtypes = response.data.data.data
                }
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi lấy danh sách phí con!";
                throw error;
            }
        },

        async createFeeType(data) {
            try {
                const response = await FeeTypeApi.createFeeType(data);
                return response.data
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi tạo loại phí";
                throw error;
            }
        },

        async updateFeeType(id, data) {
            try {
                const response = await FeeTypeApi.updateFeeType(id, data);
                return response.data
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi cập nhật loại phí";
                throw error;
            }
        },
    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error,
    }
});
