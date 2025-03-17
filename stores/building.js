import { defineStore } from "pinia";
import { BuildingApi } from "~/services/api/building.api";

export const useBuildingStore = defineStore("building", {
    state: () => ({
        buildings: [],
        pagination: null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchBuildings() {
            this.loading = true;
            this.error = null;

            try {
                const response = await BuildingApi.getBuildings();
                if (response.data) {
                    const responseData = response.data.data;
                    
                    // Lưu danh sách tòa nhà
                    this.buildings = responseData.data;
                    console.log(this.buildings);
                    
                    // Lưu thông tin phân trang
                    // this.pagination = {
                    //     currentPage: responseData.current_page,
                    //     lastPage: responseData.last_page,
                    //     total: responseData.total,
                    //     perPage: responseData.per_page,
                    //     links: responseData.links
                    // };
                } else {
                    this.buildings = [];
                    this.pagination = null;
                    this.error = response?.message || "Không thể tải dữ liệu";
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tòa nhà:", error);
                this.buildings = [];
                this.pagination = null;
                this.error = "Đã xảy ra lỗi khi tải dữ liệu";
            } finally {
                this.loading = false;
            }
        },

        goToPage(page) {
            if (page > 0 && (this.pagination?.lastPage === undefined || page <= this.pagination.lastPage)) {
                this.fetchBuildings(page);
            }
        }
    },

    getters: {
        hasBuildings: (state) => state.buildings.length > 0,
    }
});