import { defineStore } from "pinia";
import { BuildingApi } from "~/services/api/building.api";

export const useBuildingStore = defineStore("building", {
    state: () => ({
        buildingList: [],
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
        async fetchBuildingList(page = 1, perPage = '', keyword = '') {
            this.loading = true;
            try {
                const response = await BuildingApi.getListBuilding(page, perPage, keyword);
                console.log('response', response);
                if (response) {
                    this.buildingList = response.data.data.data.data;
                    this.pagination = {
                        current_page: response.data.data.data.current_page,
                        per_page: response.data.data.data.per_page,
                        total: response.data.data.data.total,
                        last_page: response.data.data.data.last_page,
                    };
                    this.error = null;
                }
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi tải dữ liệu tòa nhà!";
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
