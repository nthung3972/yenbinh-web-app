import { defineStore } from "pinia";
import { DashboardApi } from "~/services/api/dashboard.api";

export const useDashboardStore = defineStore("dashboard", {
    state: () => ({
        buildings: null,
        statsBuilding: null,
        selectedBuildingId: 'all',
        error: null,
    }),
    persist: {
        paths: ['selectedBuildingId'],  
    },

    actions: {
        async fetchStatsBuildings() {
            try {
                const response = await DashboardApi.getStatsBuildings();
                if (response.data) {
                    this.buildings = response.data?.data?.data;
                    this.error = null;
                    return this.buildings;
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu dashboard:", error);
                this.error = error;
                throw error;
            }
        },

        async fetchStatsBuilding(id) {
            if (!id || id === 'all') {
                this.statsBuilding = null;
                return null;
            }
            
            try {
                const response = await DashboardApi.getStatsBuilding(id);
                if (response.data) {
                    this.statsBuilding = response.data?.data?.data;
                    this.error = null;
                    return this.statsBuilding;
                }
            } catch (error) {
                console.error("Lỗi khi lấy dashboard từng tòa nhà:", error);
                this.error = error;
                throw error;
            }
        },

        setSelectedBuilding(id) {
            this.selectedBuildingId = id;
        },

        resetStore() {
            this.selectedBuildingId = 'all';
            this.statsBuilding = null;
        }
    },

    getters: {
        getBuildings: (state) => state.buildings,
        getStatsBuilding: (state) => state.statsBuilding,
        getSelectedBuildingId: (state) => state.selectedBuildingId,
        hasError: (state) => state.error,
        
        // Getter để lấy data hiển thị dựa trên selectedBuildingId
        getSelectedStatsData: (state) => {
            return state.selectedBuildingId === 'all' 
                ? state.buildings 
                : state.statsBuilding;
        }
    },
});
