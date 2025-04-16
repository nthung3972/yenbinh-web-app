import { defineStore } from "pinia";
import { VehicleApi } from "~/services/api/vehicle.api";
import { useDashboardStore } from '@/stores/dashboard';

export const useVehicleStore = defineStore("vehicle", {
    state: () => ({
        vehicleList: [],
        vehicle: [],
        pagination: {
            current_page: 1,
            per_page: '',
            total: 0,
            last_page: 1,
        },
        keyword: '',
        vehicle_type: '',
        loading: false,
        error: null,
    }),

    actions: {
        async fetchVehicleList(page = 1, perPage = '', keyword = '', vehicle_type= '', status) {
            const dashboardStore = useDashboardStore();
            const building_id = dashboardStore.getSelectedBuildingId;

            this.loading = true;
            try {
                const response = await VehicleApi.getListVehicle(building_id, page, perPage, keyword, vehicle_type, status);
                if (response.data && response.data.data) {
                    this.vehicleList = response.data?.data?.data?.data
                    this.pagination = {
                        current_page: response.data.data.data.current_page,
                        per_page: response.data.data.data.per_page,
                        total: response.data.data.data.total,
                        last_page: response.data.data.data.last_page,
                    };
                    this.error = null;
                }
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi tải dữ liệu xe";
            } finally {
                this.loading = false;
            }
        },

        async create(data) {
            this.loading = true;
            try {
                const response = await VehicleApi.create(data);
                if(response.data) {
                    return response.data
                }
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi tải dữ liệu xe";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fechVehicle(id) {
            this.loading = true;
            try {
                const response = await VehicleApi.edit(id);
                if(response.data) {
                    this.vehicle = response.data.data.data
                }
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateVehicle(data, id) {
            this.loading = true;
            try {
                const response = await VehicleApi.update(data, id);
                console.log('response', response);
                if(response.data.data) {
                    return response.data.data
                }
            } catch (error) {
                throw error;
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
