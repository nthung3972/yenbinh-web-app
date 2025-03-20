import { defineStore } from "pinia";
import { BuildingApi } from "~/services/api/building.api";

export const useBuildingStore = defineStore("building", {
    state: () => ({
        buildings: [],
        overview: [],
        pagination: {},
        loading: false,
        error: null
    }),

    actions: {
        async fetchBuildings(page) {
            this.loading = true;
            this.error = null;

            try {
                const response = await BuildingApi.getBuildings({ page });
                if (response.data && response.data.data) {
                    const responseData = response.data?.data?.data

                    this.buildings = responseData?.data

                    this.pagination = {
                        current_page: Number(responseData.current_page) || 1,
                        last_page: responseData.last_page,
                        total: responseData.total,
                        per_page: responseData.per_page,
                        next_page_url: responseData.next_page_url,
                        prev_page_url: responseData.prev_page_url
                    };

                } else {
                    this.buildings = [];
                    this.pagination = null;
                    this.error = response?.message || "Không thể tải dữ liệu";
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tòa nhà:", error);
                this.buildings = [];
                this.pagination = {};
                this.error = "Đã xảy ra lỗi khi tải dữ liệu";
            } finally {
                this.loading = false;
            }
        },

        async fetchOverview() {
            this.loading = true;
            this.error = null;

            try {
                const response = await BuildingApi.getOverview();
                
                if (response.data && response.data.data) {
                    this.overview = response.data?.data?.data
                }
            }catch (error) {
                console.error("Lỗi khi lấy danh sách overview:", error);
                this.error = "Đã xảy ra lỗi khi tải dữ liệu";
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        hasBuildings: (state) => state.buildings.length > 0,
    }
});
