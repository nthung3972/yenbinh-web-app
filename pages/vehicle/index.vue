<template>
    <div class="card shadow-lg p-4 border-0">
        <div v-if="isLoading" class="text-center">
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Đang tải dữ liệu...</span>
            </div>
            <p>Đang tải dữ liệu...</p>
        </div>
        <div v-else-if="hasError">{{ hasError }}</div>
        <div v-else>
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <!-- <h5 class="fw-bold text-primary mb-0">Danh Sách Căn Hộ</h5> -->
                <h5 class="fw-bold text-primary mb-0">
                    <Icon name="fluent:vehicle-cab-20-filled" size="24" /> Danh sách xe
                </h5>

                <div class="d-flex align-items-center gap-3">
                    <!-- Ô tìm kiếm -->
                    <div class="input-group">
                        <span class="input-group-text bg-white">
                            <Icon name="material-symbols:search" />
                        </span>
                        <input v-model="filters.key_search" @keyup.enter="onSearch" type="text" class="form-control"
                            placeholder="Nhập biển số xe..." />
                        <button class="btn btn-outline-primary" @click="onSearch">
                            Tìm
                        </button>
                    </div>
                    <NuxtLink to="/vehicle/create"
                        class="btn btn-primary d-flex align-items-center justify-content-center"
                        style="white-space: nowrap;">
                        <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" />
                        Thêm xe mới
                    </NuxtLink>
                </div>
            </div>

            <!-- Bộ lọc -->
            <div class="card mb-4 border shadow-sm">
                <div class="card-body">
                    <div class="row row-cols-1 row-cols-md-auto g-3 align-items-end">
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">Loại xe</label>
                            <select v-model="filters.vehicle_type" @change="onFilter" class="form-select">
                                <option value="">Tất cả</option>
                                <option value="car">Ô tô</option>
                                <option value="motorbike">Xe máy</option>
                                <option value="bicycle">Xe đạp</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label fw-semibold">Trạng thái xe</label>
                            <select v-model="filters.status" @change="onFilter" class="form-select">
                                <option value="">Tất cả</option>
                                <option :value="0">Đang hoạt động</option>
                                <option :value="1">Ngừng hoạt động</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <table class="table table-hover align-middle" style="table-layout: fixed; width: 100%;">
                <thead class="table-light sticky-top" style="z-index: 1;">
                    <tr>
                        <th style="width: 5%;">#</th>
                        <th style="width: 15%;">Biển số xe</th>
                        <th style="width: 13%;">Loại xe</th>
                        <th style="width: 10%;">Vị trí đỗ</th>
                        <th style="width: 12%;">Mã căn hộ</th>
                        <th style="width: 15%;">Trạng thái</th>
                        <th style="width: 15%;">Cập nhật bởi</th>
                        <th style="width: 20%; text-align: center;">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(vehicle, index) in vehicleStore.vehicleList" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ vehicle.license_plate }}</td>
                        <td>{{ vehicle.vehicle_type?.vehicle_type_name }}</td>
                        <td>{{ vehicle.parking_slot ?? '----' }}</td>
                        <td>{{ vehicle.apartment_number }}</td>
                        <td>
                            <span :class="[
                                'badge',
                                vehicle.status === 0 ? 'bg-success' : 'bg-secondary'
                            ]">
                                {{ vehicle.status === 0 ? 'Đang hoạt động' : 'Ngừng hoạt động' }}
                            </span>
                        </td>
                        <td>{{ vehicle.updated_by?.name ?? '----' }}</td>

                        <td class="text-center">
                            <ActionDropdown buttonText="Thao tác" iconName="bx:chevron-down">
                                <template #default="{ closeDropdown }">
                                    <DropdownItem tag="NuxtLink" :to="`/vehicle/detail/${vehicle.vehicle_id}`"
                                        iconName="bxs:detail">
                                        Xem
                                    </DropdownItem>

                                    <DropdownItem tag="NuxtLink" :to="`/vehicle/edit/${vehicle.vehicle_id}`"
                                        iconName="bxs:edit-alt">
                                        Sửa
                                    </DropdownItem>

                                    <DropdownItem v-if="authStore.isAdmin" iconName="material-symbols:delete-outline"
                                        :onClick="() => setSelectedVehicle(vehicle.vehicle_id)"
                                        :onClose="closeDropdown">
                                        Xóa
                                    </DropdownItem>
                                </template>
                            </ActionDropdown>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination :pagination="vehicleStore.pagination" @page-change="handlePageChange"
                @rows-per-page-change="rowsPerPageChange" />
        </div>
    </div>

    <ConfirmModal v-model="showDeleteModal" title="Xác nhận xóa phương tiện"
        :message="`Bạn có chắc chắn muốn xóa phương tiện này không?`" confirmText="Xóa" @confirm="deleteVehicle" />
</template>

<script setup>
import { onMounted } from 'vue';
import { useVehicleStore } from '@/stores/vehicle'
import { useAuthStore } from '@/stores/auth'
import Pagination from '@/components/pagination/Pagination.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import { useToast } from 'vue-toastification'
import ActionDropdown from '@/components/dropdown/actionDropdown.vue'
import DropdownItem from '@/components/dropdown/dropdownItem.vue'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const vehicleStore = useVehicleStore()
const authStore = useAuthStore()
const showDeleteModal = ref(false)
const vehicle_id = ref(null)
const toast = useToast()

const filters = ref({
    status: '',
    vehicle_type: '',
    key_search: '',
    page: 1,
    per_page: 10,
})

const isLoading = computed(() => vehicleStore.isLoading);
const hasError = computed(() => vehicleStore.hasError);

const setSelectedVehicle = (id) => {
    vehicle_id.value = id;
    showDeleteModal.value = true
}

const handlePageChange = (page) => {
    filters.value.page = page;
    fectVehicleList();
};

const rowsPerPageChange = (per_page) => {
    filters.value.per_page = per_page
    fectVehicleList();
};

const onFilter = () => {
    filters.value.page = 1;
    fectVehicleList();
}

const onSearch = () => {
    filters.value.page = 1;
    fectVehicleList();
};

const fectVehicleList = () => {
    const params = { ...filters.value }
    vehicleStore.fetchVehicleList(
        params.page,
        params.per_page,
        params.key_search,
        params.vehicle_type,
        params.status,
    )
}

const deleteVehicle = async () => {
    try {
        await vehicleStore.deleteVehicle(vehicle_id.value)
        toast.success("Xóa phương tiện thành công!")
        fectVehicleList()
    } catch (error) {
        if (error) {
            toast.error("Lỗi khi rời căn hộ!");
        }
    }
}

onMounted(fectVehicleList)
</script>

<style scoped>
.d-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
</style>