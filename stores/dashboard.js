import { defineStore } from "pinia";
import { DashboardApi } from "~/services/api/dashboard.api";

export const useDashboardStore = defineStore("dashboard", {
    state: () => ({
        apiData: null,
        statsBuilding: null,
        selectedBuildingId: 'all',
        error: null
    }),

    actions: {
        async fetchStatsBuildings() {
            this.loading = true;
            try {
                const response = await DashboardApi.getStatsBuildings();
                if (response.data && response.data.data) {
                    this.apiData = response.data?.data?.data
                    this.error = null;
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách overview:", error);
                this.error = "Đã xảy ra lỗi khi tải dữ liệu";
            } finally {
                this.loading = false;
            }
        },

        async fetchStatsBuilding(id) {
            if (!id) return;
            this.loading = true;
            this.selectedBuildingId = id;
            try {
                const response = await DashboardApi.getStatsBuilding(id);
                if (response.data && response.data.data) {
                    this.statsBuilding = response.data?.data?.data
                    this.error = null;
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách overview:", error);
                this.error = "Đã xảy ra lỗi khi tải dữ liệu";
            } finally {
                this.loading = false;
            }
        },

        setSelectedBuilding(id) {
            this.selectedBuildingId = id;
        }
    },

    getters: {
        getData: (state) => state.apiData,
        getStatsBuilding: (state) => state.statsBuilding,
        getSelectedBuildingId: (state) => state.selectedBuildingId,
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
    }
});
