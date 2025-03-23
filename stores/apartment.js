import { defineStore } from "pinia";
import { ApartmentApi } from "~/services/api/apartment.api";
import { useDashboardStore } from '@/stores/dashboard'

export const useApartmentStore = defineStore("apartment", {
    state: () => ({
        apartmentList: [],
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
        async fetchApartmentListByBuilding(page = 1, perPage = '', keyword = '') {
            const dashboardStore = useDashboardStore();
            const building_id = dashboardStore.getSelectedBuildingId;

            this.loading = true;
            try {
                const response = await ApartmentApi.getListByBuilding(building_id, page, perPage, keyword);
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
                console.error("Lỗi khi lấy danh sách overview:", error);
                this.error = "Đã xảy ra lỗi khi tải dữ liệu";
            } finally {
                this.loading = false;
            }
        },

        async createApartment(data) {
            console.log('data', data);
            const dashboardStore = useDashboardStore();
            const building_id = dashboardStore.getSelectedBuildingId;
            const createData = {
                ...data,
                building_id: building_id,
            }
            console.log('createData', createData);
            this.loading = true;
            try {
                const response = await ApartmentApi.create(createData);
                if (response) {
                    console.log('apartment:', response.data);
                    return response.data;
                }
                this.error = null;
            } catch (error) {
                console.error("Lỗi khi tạo căn hộ:", error);
                this.error = "Đã xảy ra lỗi khi tạo căn hộ";
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
