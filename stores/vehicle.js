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
        errors: ref({})
    }),

    actions: {
        async fetchVehicleList(page = 1, perPage = '', keyword = '', vehicle_type= '') {
            const dashboardStore = useDashboardStore();
            const building_id = dashboardStore.getSelectedBuildingId;

            this.loading = true;
            try {
                const response = await VehicleApi.getListVehicle(building_id, page, perPage, keyword, vehicle_type);
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
                console.error("Lỗi khi lấy danh sách xe:", error);
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
                console.error("Lỗi khi tạo danh sách xe:", error);
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
                console.log('this.vehicle', this.vehicle);
                
            } catch (error) {
                console.error("Lỗi khi lấy thông tin xe:", error);
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
                console.error("Lỗi khi cập nhật xe:", error);
                throw error;
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        isLoading: (state) => state.loading,
    }
});
