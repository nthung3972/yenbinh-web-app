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
        statusFilter: 'all',
        loading: false,
        error: null,
    }),

    actions: {
        async apartmentsByBuilding(page = 1, perPage = 10, keyword = '', apartment_type = '', status) {
            const dashboardStore = useDashboardStore();
            const building_id = dashboardStore.getSelectedBuildingId;

            this.loading = true;
            try {
                const response = await ApartmentApi.getListByBuilding(building_id, page, perPage, keyword, apartment_type, status);
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
                if (response.data.data) {
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
            this.loading = true;
            try {
                const response = await ApartmentApi.update(id, data);
                return response.data;
            } catch (error) {
                console.error("Lỗi khi cập nhật căn hộ:", error);
                this.error = "Đã xảy ra lỗi khi cập nhật căn hộ!";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getCodeApartments(id) {
            this.loading = true
            try {
                const response = await ApartmentApi.getCodeApartments(id)
                if (response.data) {
                    return response.data.data.data
                }
                this.error = null
            }catch (error) {
                console.error("Lỗi khi cập nhật căn hộ:", error);
                this.error = "Đã xảy ra lỗi khi cập nhật căn hộ!";
                throw error;
            } finally {
                this.loading = false;
            }
        }, 

        async getResidentsByApartment(code) {
            this.loading = true
            try {
                const response = await ApartmentApi.getResidentsByApartment(code)
                if (response.data) {
                    return response.data.data.data
                }
                this.error = null
            } catch (error) {
                console.error("Lỗi khi cập nhật căn hộ:", error);
                this.error = "Đã xảy ra lỗi khi cập nhật căn hộ!";
                throw error;
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        apartmentsWithStatus: (state) => {
            return state.apartmentList.map(apartment => ({
                ...apartment,
                status: apartment.residents[0]?.full_name ? 'occupied' : 'vacant'
            }));
        },
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
    }
});
