import { defineStore } from "pinia";
import { ResidentApi } from "~/services/api/resident.api";
import { useDashboardStore } from '@/stores/dashboard';

export const useResidentStore = defineStore("resident", {
    state: () => ({
        residentList: [],
        resident: [],
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
        async fetchResidentList(page = 1, perPage = '', keyword = '') {
            const dashboardStore = useDashboardStore();
            const building_id = dashboardStore.getSelectedBuildingId;

            this.loading = true;
            try {
                const response = await ResidentApi.getListResident(building_id, page, perPage, keyword);
                if (response) {
                    this.residentList = response.data.data.data.data;
                    this.pagination = {
                        current_page: response.data.data.data.current_page,
                        per_page: response.data.data.data.per_page,
                        total: response.data.data.data.total,
                        last_page: response.data.data.data.last_page,
                    };
                    this.error = null;
                }
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi tải dữ liệu cư dân!";
            } finally {
                this.loading = false;
            }
        },

        async createResident(data) {
            this.loading = true;
            try {
                const response = await ResidentApi.create(data);
                return response.data
            }catch (error) {
                this.error = "Đã xảy ra lỗi khi tạo cư dân";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchResident(id) {
            this.loading = true;
            try {
                const response = await ResidentApi.edit(id);
                if(response.data) {
                    this.resident = response.data.data.data[0]
                }
                this.error = null;
            }catch (error) {
                this.error = "Đã xảy ra lỗi khi lấy thông tin cư dân";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async addResidentToApartment(data, id) {
            try {
                const response = await ResidentApi.addResidentToApartment(data, id)
                return response.data
            }catch (error) {
                this.error = "Đã xảy ra lỗi khi thêm cư dân vào căn hộ";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteResidentToApartment(data, id) {
            try {
                const response = await ResidentApi.deleteResidentToApartment(data, id)
                return response.data
            }catch (error) {
                this.error = "Đã xảy ra lỗi khi khi xóa cư dân khỏi căn hộ";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateResident(data, id) {
            try {
                console.log(data)
                const response = await ResidentApi.update(data, id)
                return response.data
            }catch (error) {
                this.error = "Đã xảy ra lỗi khi khi xóa cư dân khỏi căn hộ";
                throw error;
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
