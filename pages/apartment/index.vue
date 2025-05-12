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
                <h5 class="fw-bold text-primary mb-0">
                    <Icon name="ion:home" size="24" class="me-2" /> Danh sách căn hộ
                </h5>

                <div class="d-flex align-items-center gap-3">
                    <div class="input-group">
                        <span class="input-group-text bg-white">
                            <Icon name="material-symbols:search" />
                        </span>
                        <input v-model="filters.key_search" @keyup.enter="onSearch" type="text" class="form-control"
                            placeholder="Nhập số căn hộ..." />
                        <button class="btn btn-outline-primary" @click="onSearch">
                            Tìm
                        </button>
                    </div>
                    <NuxtLink to="/apartment/create"
                        class="btn btn-success d-flex align-items-center justify-content-center"
                        style="white-space: nowrap;">
                        <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" />
                        Thêm căn hộ
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
                        <!-- Loại căn hộ -->
                        <div class="col-md-3">
                            <div class="form-label-group">
                                <select v-model="filters.apartment_type" @change="onFilter" class="form-select"
                                    id="typeSelect">
                                    <option value="">Tất cả</option>
                                    <option value="studio">Căn hộ Studio</option>
                                    <option value="1bedroom">1 Phòng ngủ</option>
                                    <option value="2bedroom">2 Phòng ngủ</option>
                                    <option value="3bedroom">3 Phòng ngủ</option>
                                    <option value="duplex">Căn hộ thông tầng</option>
                                    <option value="penthouse">Căn hộ áp mái</option>
                                    <option value="dualkey">Căn hộ song lập</option>
                                </select>
                                <label for="typeSelect">Loại căn hộ<span class="required-mark"></span></label>
                            </div>
                        </div>

                        <!-- Trạng thái -->
                        <div class="col-md-3">
                            <div class="form-label-group">
                                <select v-model="filters.status" @change="onFilter" class="form-select">
                                    <option value="">Tất cả</option>
                                    <option value="occupied">Đang sử dụng</option>
                                    <option value="vacant">Căn hộ trống</option>
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
                            <th style="width: 10%;">Mã căn hộ</th>
                            <th style="width: 15%;">Loại căn hộ</th>
                            <th style="width: 15%;">Diện tích(m²)</th>
                            <th style="width: 20%;">Chủ sở hữu</th>
                            <th style="width: 15%;">Tình trạng</th>
                            <th style="width: 15%;">Cập nhật bởi</th>
                            <th style="width: 15%; text-align: center;">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(apartment, index) in apartmentStore.apartmentsWithStatus" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ apartment.apartment_number }}</td>
                            <td>{{ getApartmentTypeLabel(apartment.apartment_type) }}</td>
                            <td>{{ apartment.area }}</td>
                            <td>{{ apartment.current_residents[0]?.full_name ?? '---' }}</td>
                            <td>
                                <span :class="[
                                    'badge rounded-pill px-3 py-2',
                                    apartment.status === 'occupied' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-muted'
                                ]">
                                    {{ apartment.status === 'occupied' ? 'Đang sử dụng' : 'Căn hộ trống' }}
                                </span>
                            </td>
                            <td>{{ apartment.updated_by?.name ?? '---' }}</td>


                            <td class="text-center">
                                <ActionDropdown buttonText="Thao tác" iconName="bx:chevron-down">
                                    <template #default="{ closeDropdown }">
                                        <DropdownItem tag="NuxtLink" :to="`/apartment/detail/${apartment.apartment_id}`"
                                            iconName="bxs:detail">
                                            Chi tiết
                                        </DropdownItem>

                                        <DropdownItem tag="NuxtLink" :to="`/apartment/${apartment.apartment_id}/edit`"
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
            <Pagination :pagination="apartmentStore.pagination" @page-change="handlePageChange"
                @rows-per-page-change="rowsPerPageChange" />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useApartmentStore } from '@/stores/apartment'
import { useAuthStore } from '@/stores/auth'
import Pagination from '@/components/pagination/Pagination.vue'
import ActionDropdown from '@/components/dropdown/actionDropdown.vue'
import DropdownItem from '@/components/dropdown/dropdownItem.vue'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const apartmentStore = useApartmentStore()
const authStore = useAuthStore()

const filters = ref({
    apartment_type: '',
    status: '',
    key_search: '',
    page: 1,
    per_page: 10,
})

const getApartmentTypeLabel = (type) => {
    const labels = {
        'studio': 'Căn hộ Studio',
        '1bedroom': '1 Phòng ngủ',
        '2bedroom': '2 Phòng ngủ',
        '3bedroom': '3 Phòng ngủ',
        'dualkey': 'Căn hộ song lập',
        'penthouse': 'Căn hộ áp mái',
        'duplex': 'Căn hộ thông tầng',
    }

    return labels[type] || 'Không xác định'
}

const isLoading = computed(() => apartmentStore.isLoading)
const hasError = computed(() => apartmentStore.hasError)

const handlePageChange = (page) => {
    filters.value.page = page
    loadApartments();
};

const rowsPerPageChange = (per_page) => {
    filters.value.per_page = per_page
    loadApartments();
};

const onSearch = () => {
    filters.value.page = 1
    loadApartments();
};

const onFilter = () => {
    filters.value.page = 1
    loadApartments()
}

const loadApartments = async() => {
    const params = { ...filters.value }
    await apartmentStore.apartmentsByBuilding(
        params.page,
        params.per_page,
        params.key_search,
        params.apartment_type,
        params.status
    )
    console.log('params', apartmentStore.apartmentsWithStatus)
}

onMounted(loadApartments);
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