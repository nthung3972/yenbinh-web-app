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
                <h4 class="fw-bold text-primary mb-0">
                    <Icon name="mdi:car" size="28" class="me-2" /> Danh sách xe
                </h4>

                <div class="d-flex align-items-center gap-3">
                    <!-- Ô tìm kiếm -->
                    <div class="input-group">
                        <span class="input-group-text bg-white">
                            <Icon name="material-symbols:search" />
                        </span>
                        <input v-model="filters.key_search" @keyup.enter="onSearch" type="text" class="form-control"
                            placeholder="Biển số xe, số căn hộ..." />
                        <button class="btn btn-outline-primary" @click="onSearch">
                            Tìm
                        </button>
                    </div>
                    <NuxtLink to="/vehicle/create"
                        class="btn btn-success d-flex align-items-center justify-content-center"
                        style="white-space: nowrap;">
                        <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" />
                        Thêm xe mới
                    </NuxtLink>
                </div>
            </div>

            <!-- Bộ lọc -->
            <div class="card mb-4 border shadow-sm">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <h6 class="fw-bold text-info mb-0">
                            <Icon name="codicon:filter-filled" size="18" class="me-1" />Bộ lọc tìm kiếm
                        </h6>
                    </div>

                    <div class="row row-cols-1 row-cols-md-auto g-3 align-items-end">
                        <div class="col-md-3">
                             <div class="form-label-group">
                                <select v-model="filters.vehicle_type_id" @change="onFilter" class="form-select">
                                    <option value="">Tất cả</option>
                                    <option :value="1">Ô tô</option>
                                    <option :value="2">Xe máy, xe máy điện</option>
                                    <option :value="3">Xe đạp, xe đạp điện</option>
                                </select>
                                <label for="typeSelect">Loại phương tiện<span class="required-mark"></span></label>
                             </div>
                        </div>

                        <div class="col-md-3">
                            <div class="form-label-group">
                                <select v-model="filters.status" @change="onFilter" class="form-select">
                                    <option value="">Tất cả</option>
                                    <option :value="0">Đang hoạt động</option>
                                    <option :value="1">Ngừng hoạt động</option>
                                </select>
                                <label for="statusSelect">Trạng thái<span class="required-mark"></span></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <table class="table table-hover align-middle" style="table-layout: fixed; width: 100%;">
                <thead class="table-primary sticky-top" style="z-index: 1;">
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
                                'badge rounded-pill px-3 py-2',,
                                vehicle.status === 0 ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-muted'
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
    vehicle_type_id: '',
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
        params.vehicle_type_id,
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
.form-container {
    width: 100%;
    margin: 1rem auto;
}

.card {
    border: none;
    border-radius: 10px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.card-header {
    padding: 1.5rem;
}

.card-body {
    padding: 1rem 1rem 0 1rem;
}

.form-label {
    font-weight: 600;
    color: #495057;
    margin-bottom: 0.5rem;
}

.form-control-custom,
.form-select {
    padding: 0.75rem;
    border-radius: 7px;
    border: 1px solid #ced4da;
    transition: all 0.2s;
}

.form-control:focus,
.form-select:focus {
    border-color: #4e73df;
    box-shadow: 0 0 0 0.25rem rgba(78, 115, 223, 0.25);
}

.input-group-text {
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    border-radius: 7px 0 0 7px;
}

.btn-primary {
    background: linear-gradient(45deg, #4e73df, #224abe);
    border: none;
    padding: 0.75rem;
    font-weight: 600;
    border-radius: 7px;
    transition: all 0.3s;
}

.btn-primary:hover {
    background: linear-gradient(45deg, #224abe, #1e40af);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(33, 37, 41, 0.2);
}

.required-mark {
    color: #dc3545;
    margin-left: 3px;
}

.help-text {
    font-size: 0.8rem;
    color: #6c757d;
    margin-top: 0.25rem;
}

.header-icon {
    margin-right: 10px;
}

.form-section {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 1.1rem;
    color: #4e73df;
    border-bottom: 2px solid #eaecf4;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
}

/* Form label group để tránh đè label */
.form-label-group {
    position: relative;
    margin-bottom: 1rem;
}

.form-label-group>label {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    margin-bottom: 0;
    padding: 0.75rem;
    color: #495057;
    pointer-events: none;
    cursor: text;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    transition: all 0.1s ease-in-out;
}

.form-label-group input:focus~label,
.form-label-group input:not(:placeholder-shown)~label,
.form-label-group textarea:focus~label,
.form-label-group textarea:not(:placeholder-shown)~label,
.form-label-group select:focus~label,
.form-label-group select:not(:placeholder-shown)~label {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    font-size: 12px;
    color: #4e73df;
    background-color: white;
    top: -10px;
    left: 10px;
    z-index: 1;
    padding-left: 5px;
    padding-right: 5px;
}

/* Các style cho input number với đơn vị */
.input-with-unit {
    position: relative;
}

.input-unit {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
    font-weight: 500;
    pointer-events: none;
}

/* Màu cho badge trạng thái */
.status-badge {
    padding: 0.5rem 0.75rem;
    border-radius: 50px;
    font-weight: 500;
    display: inline-block;
}

.status-available {
    background-color: #e8f5e9;
    color: #2e7d32;
}

.status-rented {
    background-color: #e3f2fd;
    color: #1565c0;
}

.status-maintenance {
    background-color: #fff3e0;
    color: #e65100;
}

.status-reserved {
    background-color: #f3e5f5;
    color: #6a1b9a;
}

/* Thêm chút hoạt ảnh cho các phần tử */
.animate-fade {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>