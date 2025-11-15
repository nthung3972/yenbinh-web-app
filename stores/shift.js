import { defineStore } from "pinia";
import { ShiftApi } from "~/services/api/shift.api";

export const useShiftStore = defineStore("shift", {
    state: () => ({
        shifts: [],
        shift: {},
        pagination: {
            current_page: 1,
            per_page: '',
            total: 0,
            last_page: 1,
        },
        loading: false,
        error: null,
    }),

    actions: {
        async fetchShifts(page, perPage, keyword, buildingId) {
            this.loading = true;
            try {
                const response = await ShiftApi.getShifts(page, perPage, keyword, buildingId);
                if (response) {
                    this.shifts = response.data.data.data.data;
                    this.pagination = {
                        current_page: response.data.data.data.current_page,
                        per_page: response.data.data.data.per_page,
                        total: response.data.data.data.total,
                        last_page: response.data.data.data.last_page,
                    };
                    this.error = null;
                }
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi tải dữ liệu ca làm việc!";
            } finally {
                this.loading = false;
            }
        },

        async createShift(data) {
            this.loading = true;
            try {
                const response = await ShiftApi.create(data);
                console.log(response);
                return response.data
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi tạo ca làm việc";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchShift(shiftId) {
            this.loading = true;
            try {
                const response = await ShiftApi.edit(shiftId);
                console.log(response);
                if (response) {
                    this.shift = response.data.data.data;
                    this.error = null;
                }
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi tải dữ liệu ca làm việc!";
            } finally {
                this.loading = false;
            }
        },

        async updateShift(shiftId, data) {
            this.loading = true; 
            try {
                const response = await ShiftApi.update(shiftId, data);
                console.log(response);
                return response.data
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi cập nhật ca làm việc";
                throw error;
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error,
    }
});