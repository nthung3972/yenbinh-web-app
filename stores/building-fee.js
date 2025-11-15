import { defineStore } from "pinia";
import { BuildingFeeApi } from "~/services/api/building-fee.api";
import { BuildingApi } from "~/services/api/building.api";

export const useBuildingFeeStore = defineStore("building-fee", {
    state: () => ({
        buildingFees: [],
        buildingFee: {},
        pagination: {
            current_page: 1,
            per_page: '',
            total: 0,
            last_page: 1,
        },
        loading: false,
        error: null,
        lastFetched: 0,
        cache: {}
    }),

    actions: {
        async getBuildingFees(building_id, page = 1, per_page = 10, keyword = '', fee_types_id = '') {
            const now = Date.now()
            const CACHE_TTL = 30000

            const cacheKey = `${building_id}_${page}_${per_page}_${keyword || 'none'}_${fee_types_id || 'none'}`

            if (!this.cache) this.cache = {}

            const cached = this.cache[cacheKey]
            if (cached && now - cached.timestamp < CACHE_TTL) {
                this.buildingFees = cached.data
                this.pagination = cached.pagination
                return
            }

            this.loading = true
            this.error = null

            try {
                const response = await BuildingFeeApi.getBuildingFees(building_id, page, per_page, keyword, fee_types_id)
                if (response) {
                    const data = response.data.data.data

                    this.buildingFees = data.data
                    this.pagination = {
                        current_page: data.current_page,
                        per_page: data.per_page,
                        total: data.total,
                        last_page: data.last_page,
                    }

                    this.cache[cacheKey] = {
                        data: this.buildingFees,
                        pagination: this.pagination,
                        timestamp: now
                    }
                }
            } catch (error) {
                this.error = 'Đã xảy ra lỗi khi tải danh sách biểu phí!'
            } finally {
                this.loading = false
            }
        },

        async getBuildingFee(id) {
            this.loading = true
            try {
                const response = await BuildingFeeApi.getBuildingFee(id)
                if (response) {
                    this.buildingFee = response.data.data.data
                }
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi lấy dữ liệu phí tòa nhà!";
                throw error;
            } finally {
                this.loading = false
            }

        },

        async createBuildingFee(data) {
            this.loading = true;
            try {
                const response = await BuildingFeeApi.createBuildingFee(data);
                if (response) {
                    this.invalidateBuildingFees()
                }
                return response.data
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateBuildingFee(id, data) {
            this.loading = true;
            try {
                const response = await BuildingFeeApi.updateBuildingFee(id, data);
                if (response) {
                    this.invalidateBuildingFees()
                }
                return response.data
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi cập nhật phí tòa nhà";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        invalidateBuildingFees() {
            this.buildingFees = []
            this.lastFetched = 0
            this.cache = {}
        }
    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error,
    }
});
