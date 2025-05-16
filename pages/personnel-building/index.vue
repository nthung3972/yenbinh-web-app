<template>
    <div class="card shadow-lg p-4 border-0">
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải dữ liệu...</span>
            </div>
            <p class="text-muted mt-2">Đang tải dữ liệu...</p>
        </div>

        <div v-else-if="hasError" class="alert alert-danger text-center">{{ hasError }}</div>

        <div v-else>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="fw-bold text-primary mb-0">
                    <Icon name="icon-park-outline:file-staff-one" size="28" class="me-2" /> Danh sách nhân sự
                </h4>

                <div class="d-flex align-items-center gap-3">
                    <div class="input-group">
                        <span class="input-group-text bg-white">
                            <Icon name="material-symbols:search" />
                        </span>
                        <input v-model="filters.key_search" @keyup.enter="onSearch" type="text" class="form-control"
                            placeholder="Nhập tên nhân sự..." />
                        <button class="btn btn-outline-primary" @click="onSearch">
                            Tìm
                        </button>
                    </div>
                    <NuxtLink to="/personnel-building/create"
                        class="btn btn-success d-flex align-items-center justify-content-center"
                        style="white-space: nowrap;">
                        <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" />
                        Thêm nhân sự
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
                        <!-- Vị trí -->
                        <div class="col-md-3">
                            <div class="form-label-group">
                                <select v-model="filters.position" @change="onFilter" class="form-select"
                                    id="typeSelect">
                                    <option value="">Tất cả</option>
                                    <option value="manager">Trưởng BQL</option>
                                    <option value="assistant_manager">Phó trưởng BQL</option>
                                    <option value="supervisor">Giám sát</option>
                                    <option value="accountant">Kế toán</option>
                                    <option value="receptionist">Lễ tân</option>
                                    <option value="cleaner">Vệ sinh</option>
                                    <option value="technical">Kỹ thuật</option>
                                    <option value="security">Bảo vệ</option>
                                </select>
                                <label for="typeSelect">Vị trí làm việc<span class="required-mark"></span></label>
                            </div>
                        </div>

                        <!-- Trạng thái -->
                        <div class="col-md-3">
                            <div class="form-label-group">
                                <select v-model="filters.status" @change="onFilter" class="form-select">
                                    <option value="">Tất cả</option>
                                    <option :value="0">Đang làm việc</option>
                                    <option :value="1">Đã nghỉ việc</option>
                                </select>
                                <label for="typeSelect">Trạng thái<span class="required-mark"></span></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <div class="table-responsive">
                <table class="table table-hover align-middle" style="table-layout: fixed; width: 100%;">
                    <thead class="table-primary sticky-top" style="z-index: 1;">
                        <tr>
                            <th style="width: 5%;">#</th>
                            <th style="width: 17%;">Tên nhân viên</th>
                            <th style="width: 13%;">Số điện thoại</th>
                            <th style="width: 15%;">Địa chỉ</th>
                            <th style="width: 12%;">Vị trí</th>
                            <th style="width: 12%;">Ngày bắt đầu</th>
                            <th style="width: 11%;">Ngày kết thúc</th>
                            <th style="width: 10%; text-align: center;">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(personnel, index) in buildingPersonnelStore.buildingPersonnels" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ personnel.personnel_name }}</td>
                            <td>{{ personnel.personnel_phone }}</td>   
                            <td>{{ personnel.personnel_address }}</td>
                            <td>{{ getPositionLabel(personnel.position) }}</td>
                            <td>{{ formatDate(personnel.start_date) }}</td>
                            <td>{{ personnel.move_out_date ? formatDate(personnel.move_out_date) : '----' }}</td>
                            <td class="text-center">
                                <ActionDropdown buttonText="Thao tác" iconName="bx:chevron-down">
                                    <template #default="{ closeDropdown }">
                                        <!-- <DropdownItem tag="NuxtLink" :to="`/apartment/detail/${personnel.building_personnel_id
}`"
                                            iconName="bxs:detail">
                                            Chi tiết
                                        </DropdownItem> -->

                                        <DropdownItem tag="NuxtLink" :to="`/personnel-building/edit/${personnel.building_personnel_id}`"
                                            iconName="bxs:edit-alt">
                                            Chỉnh sửa
                                        </DropdownItem>
                                    </template>
                                </ActionDropdown>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <Pagination :pagination="buildingPersonnelStore.pagination" @page-change="handlePageChange"
                @rows-per-page-change="rowsPerPageChange" />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useBuildingPersonnelStore } from '@/stores/building-personnel'
import Pagination from '@/components/pagination/Pagination.vue'
import ActionDropdown from '@/components/dropdown/actionDropdown.vue'
import DropdownItem from '@/components/dropdown/dropdownItem.vue'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const buildingPersonnelStore = useBuildingPersonnelStore()

const filters = ref({
    position: '',
    status: '',
    key_search: '',
    page: 1,
    per_page: 10,
})

const getPositionLabel = (type) => {
    const labels = {
        'accountant': 'Kế toán',
        'cleaner': 'Vệ sinh',
        'security': 'Bảo vệ',
        'receptionist': 'Lễ tân',
        'technical': 'Kỹ thuật',
        'supervisor': 'Giám sát',
        'assistant_manager': 'Phó trưởng BQL',
        'manager': 'Trưởng BQL',
    }

    return labels[type] || 'Không xác định'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("vi-VN");
}

const isLoading = computed(() => buildingPersonnelStore.isLoading)
const hasError = computed(() => buildingPersonnelStore.hasError)

const handlePageChange = (page) => {
    filters.value.page = page
    loadBuildingPersonnels();
};

const rowsPerPageChange = (per_page) => {
    filters.value.per_page = per_page
    loadBuildingPersonnels();
};

const onSearch = () => {
    filters.value.page = 1
    loadBuildingPersonnels();
};

const onFilter = () => {
    filters.value.page = 1
    loadBuildingPersonnels()
}

const loadBuildingPersonnels = async() => {
    const params = { ...filters.value }
    await buildingPersonnelStore.getBuildingPersonnels(
        params.page,
        params.per_page,
        params.key_search,
        params.position,
        params.status
    )
}

onMounted(loadBuildingPersonnels);
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
