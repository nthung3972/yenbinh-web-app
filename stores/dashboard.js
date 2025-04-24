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
            try {
                const response = await DashboardApi.getStatsBuildings();
                if (response.data) {
                    this.error = null;
                    return response.data?.data?.data
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu dashboard:", error);
                this.error = error;
            }
        },

        async fetchStatsBuilding(id) {
            if (!id) return;
            this.selectedBuildingId = id;
            try {
                const response = await DashboardApi.getStatsBuilding(id);
                if (response.data) {
                    this.error = null;
                    return response.data?.data?.data
                }
            } catch (error) {
                console.error("Lỗi khi lấy dashboard từng tòa nhà:", error);
                this.error = error;
            }
        },

        setSelectedBuilding(id) {
            this.selectedBuildingId = id;
        },

        resetStore() {
            this.selectedBuildingId = 'all'
        }
    },

    getters: {
        getData: (state) => state.apiData,
        getStatsBuilding: (state) => state.statsBuilding,
        getSelectedBuildingId: (state) => state.selectedBuildingId,
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
    },
});
