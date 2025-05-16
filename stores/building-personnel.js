import { defineStore } from "pinia";
import { buildingPersonnelApi } from "~/services/api/building-personnel.api";
import { useDashboardStore } from '@/stores/dashboard'

export const useBuildingPersonnelStore = defineStore("building-personnel", {
    state: () => ({
        buildingPersonnels: [],
        personnel: {},
        pagination: {
            current_page: 1,
            per_page: '',
            total: 0,
            last_page: 1,
        },
        keyword: '',
        statusFilter: 'all',
        loading: false,
        error: null,
    }),

    actions: {
        async getBuildingPersonnels(page = 1, perPage = 10, keyword = '', position = '', status) {
            const dashboardStore = useDashboardStore();
            const building_id = dashboardStore.getSelectedBuildingId;

            this.loading = true;
            try {
                const response = await buildingPersonnelApi.getListByBuilding(building_id, page, perPage, keyword, position, status);
                if (response) {
                    this.buildingPersonnels = response.data.data.data.data;
                    this.pagination = {
                        current_page: response.data.data.data.current_page,
                        per_page: response.data.data.data.per_page,
                        total: response.data.data.data.total,
                        last_page: response.data.data.data.last_page,
                    };
                    this.error = null;
                }
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi tải dữ liệu căn hộ!";
            } finally {
                this.loading = false;
            }
        },

        async getPersonnel(id) {
            this.loading = true
            try {
                const response = await buildingPersonnelApi.edit(id)
                if (response.data) {
                    this.personnel = response.data.data.data
                }
                this.error = null
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi tải thông tin tòa nhà!";
                throw error;
            } finally {
                this.loading = false
            }
        },

        async create(data) {
            const dashboardStore = useDashboardStore();
            const building_id = dashboardStore.getSelectedBuildingId;
            const createData = {
                ...data,
                building_id: building_id,
            }
            this.loading = true;
            try {
                const response = await buildingPersonnelApi.create(createData);
                return response.data;
            } catch (error) {
                console.error("Lỗi khi tạo căn hộ:", error);
                this.error = "Đã xảy ra lỗi khi thêm nhân viên";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updatePersonnel(id, data) {
            this.loading = true
            try {
                console.log(data)
                const response = await buildingPersonnelApi.update(id, data)
                console.log('response', response)
                this.error = null
            } catch (error) {
                this.error = "Đã xảy ra lỗi khi cập nhật thông tin nhân sự!";
                throw error;
            } finally {
                this.loading = false
            }
        },

    },

    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
    }
});
