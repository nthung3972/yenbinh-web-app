import { defineStore } from "pinia";
import { ApartmentApi } from "~/services/api/apartment.api";
import { useDashboardStore } from '@/stores/dashboard'

export const useApartmentStore = defineStore("apartment", {
    state: () => ({
        apartmentList: [],
    }),

    actions: {
        async fetchApartmentListByBuilding() {
            const dashboardStore = useDashboardStore();
            const building_id = dashboardStore.getSelectedBuildingId;

            this.loading = true;
            try {
                const response = await ApartmentApi.getListByBuilding(building_id);
                if (response.data) {
                    this.apartmentList = response.data?.data?.data
                    this.error = null;
                }
            }catch (error) {
                console.error("Lỗi khi lấy danh sách overview:", error);
                this.error = "Đã xảy ra lỗi khi tải dữ liệu";
            } finally {
                this.loading = false;
            }
        },
    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
    }
});
