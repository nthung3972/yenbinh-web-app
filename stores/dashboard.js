import { defineStore } from "pinia";
import { DashboardApi } from "~/services/api/dashboard.api";

export const useDashboardStore = defineStore("dashboard", {
    state: () => ({
        collectionRate: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchCollectionRate() {
            
            this.loading = true;
            this.error = null;
            try {
                const response = await DashboardApi.getCollectionRate();
                if (response.data) {
                    this.collectionRate = response.data
                    console.log('collectionRate', this.collectionRate)
                }
            }catch (error) {
                console.error("Lỗi khi lấy danh sách overview:", error);
                this.error = "Đã xảy ra lỗi khi tải dữ liệu";
            } finally {
                this.loading = false;
            }
        }
    }
});
