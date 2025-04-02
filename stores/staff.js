import { defineStore } from "pinia";
import { StaffApi } from "~/services/api/staff.api";

export const useStaffStore = defineStore("staff", {
    state: () => ({
        staffList: [],
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
        async fetchStaffList(page = 1, perPage = '', keyword = '') {
            this.loading = true;
            try {
                const response = await StaffApi.getListStaff(page, perPage, keyword);
                if (response) {
                    this.staffList = response.data.data.data.data;
                    this.pagination = {
                        current_page: response.data.data.data.current_page,
                        per_page: response.data.data.data.per_page,
                        total: response.data.data.data.total,
                        last_page: response.data.data.data.last_page,
                    };
                    this.error = null;
                }
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi tải dữ liệu nhân viên!";
            } finally {
                this.loading = false;
            }
        },

        async createStaff(data) {
            this.loading = true
            try {
                const response = await StaffApi.create(data)
                if(response.data) {
                    return response.data
                }
                this.error = null
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi thêm nhân viên!";
                throw error;
            } finally {
                this.loading = false
            }
        },

        async deleteStaff(id) {
            this.loading = true
            try {
                const response = await StaffApi.delete(id)
                if(response.data) {
                    return response.data
                }
                this.error = null
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi xóa nhân viên!";
                throw error;
            } finally {
                this.loading = false
            }
        }
    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
    },
});
