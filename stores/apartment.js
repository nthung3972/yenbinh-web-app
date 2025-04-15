import { defineStore } from "pinia";
import { ApartmentApi } from "~/services/api/apartment.api";
import { useDashboardStore } from '@/stores/dashboard'

export const useApartmentStore = defineStore("apartment", {
    state: () => ({
        apartmentList: [],
        apartment: [],
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
        async fetchApartmentListByBuilding(page = 1, perPage = '', keyword = '', status = '', apartment_type = '') {
            const dashboardStore = useDashboardStore();
            const building_id = dashboardStore.getSelectedBuildingId;

            this.loading = true;
            try {
                const response = await ApartmentApi.getListByBuilding(building_id, page, perPage, keyword, status, apartment_type);
                if (response) {
                    this.apartmentList = response.data.data.data.data;
                    this.pagination = {
                        current_page: response.data.data.data.current_page,
                        per_page: response.data.data.data.per_page,
                        total: response.data.data.data.total,
                        last_page: response.data.data.data.last_page,
                    };
                    this.error = null;
                }
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi tải dữ liệu căn hộ!";
            } finally {
                this.loading = false;
            }
        },

        async createApartment(data) {
            const dashboardStore = useDashboardStore();
            const building_id = dashboardStore.getSelectedBuildingId;
            const createData = {
                ...data,
                building_id: building_id,
            }
            this.loading = true;
            try {
                const response = await ApartmentApi.create(createData);
                return response.data;
            } catch (error) {
                console.error("Lỗi khi tạo căn hộ:", error);
                this.error = "Đã xảy ra lỗi khi tạo căn hộ";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async detailApartment(id) {
            this.loading = true;
            try {
                const response = await ApartmentApi.edit(id);
                console.log(response)
                if(response.data.data) {
                    this.apartment = response.data.data[0]
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin căn hộ:", error);
                this.error = "Đã xảy ra lỗi khi lấy thông tin căn hộ!";
            } finally {
                this.loading = false;
            }
        },

        async updateApartment(id, data) {
            console.log('data', data)
            this.loading = true;
            try {
                const response = await ApartmentApi.update(id, data);
                return response.data;
            } catch (error) {
                console.error("Lỗi khi cập nhật căn hộ:", error);
                this.error = "Đã xảy ra lỗi khi cập nhật căn hộ!";
                // Quan trọng: Throw lại error để component có thể bắt được
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
