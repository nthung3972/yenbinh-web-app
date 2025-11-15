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
                <h5 class="fw-bold text-primary mb-0">
                    <Icon name="mdi:meter-electric" size="28" class="me-2" /> Danh sách chỉ số
                </h5>

                <div class="d-flex align-items-center gap-3">
                    <NuxtLink to="/utilities/import"
                        class="btn btn-success d-flex align-items-center justify-content-center"
                        style="white-space: nowrap;">
                        <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" />
                        Nhập dữ liệu Excel
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
                                <input v-model="filters.period" type="month" class="form-select" @change="onFilter" />
                                <label for="typeSelect">Thời gian<span class="required-mark"></span></label>
                            </div>
                        </div>

                        <div class="col-md-3">
                            <div class="form-label-group">
                                <select v-model="filters.utility_type" @change="onFilter" class="form-select">
                                    <option value="">Tất cả</option>
                                    <option value="electric">Chỉ số điện</option>
                                    <option value="water">Chỉ số nước</option>
                                </select>
                                <label for="statusSelect">Loại chỉ số<span class="required-mark"></span></label>
                            </div>
                        </div>

                        <div class="col-md-3">
                            <div class="form-label-group">
                                <select v-model="filters.status" @change="onFilter" class="form-select">
                                    <option value="">Tất cả</option>
                                    <option value="pending">Chờ xác nhận</option>
                                    <option value="confirmed">Đã xác nhận</option>
                                    <option value="billed">Đã lập hóa đơn</option>
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
                        <th style="width: 15%">Căn hộ</th>
                        <th style="width: 10%">Loại</th>
                        <th style="width: 10%">Chỉ số đầu</th>
                        <th style="width: 10%">Chỉ số cuối</th>
                        <th style="width: 10%">Tiêu thụ</th>
                        <th style="width: 10%">Đơn giá</th>
                        <th style="width: 10%">Thành tiền</th>
                        <th style="width: 20%">Trạng thái</th>
                    </tr>
                </thead>
                <tbody v-if="utilityReadingStore.utilities.length > 0">
                    <tr v-for="(utility, index) in utilityReadingStore.utilities" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <strong>{{ utility.apartment_name }}</strong>
                        </td>
                        <td>
                            <span :class="`badge bg-${utility.utility_type === 'electric' ? 'warning' : 'info'}`">
                                {{ utility.utility_type === 'electric' ? '⚡ Điện' : '💧 Nước' }}
                            </span>
                        </td>
                        <td>{{ formatNumber(utility.previous_reading) }}</td>
                        <td>{{ formatNumber(utility.current_reading) }}</td>
                        <td>
                            <strong>{{ formatNumber(utility.consumption) }}</strong>
                            <small>
                                {{ utility.utility_type === 'electric' ? 'số' : 'm³' }}
                            </small>
                        </td>
                        <td>{{ formatCurrency(utility.unit_price) }}</td>
                        <td>
                            <strong class="text-primary">{{ formatCurrency(utility.amount) }}</strong>
                        </td>
                        <td>
                            <span :class="`badge bg-${getStatusColor(utility.status)}`">
                                {{ getStatusText(utility.status) }}
                            </span>
                        </td>
                    </tr>
                </tbody>

                <tbody v-else>
                    <tr>
                        <td colspan="9" class="text-center text-muted py-3">
                            Chưa có dữ liệu điện nước hoặc không tìm thấy dữ liệu điện nước phù hợp!
                        </td>
                    </tr>
                </tbody>

            </table>
            <Pagination :pagination="utilityReadingStore.pagination" @page-change="handlePageChange"
                @rows-per-page-change="rowsPerPageChange" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useUtilityReadingStore } from '@/stores/utility-reading'
import { useInitialData } from '@/composables/useInitialData';
import Pagination from '@/components/pagination/Pagination.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import { useToast } from 'vue-toastification'

definePageMeta({
    middleware: "auth",
    layout: "dashboard",
    breadcrumb: 'Quản lý điện nước',
})

const utilityReadingStore = useUtilityReadingStore()
const { selectedBuildingId } = useInitialData()

const vehicleStore = useVehicleStore()
const showDeleteModal = ref(false)
const toast = useToast()

const filters = ref({
    period: '',
    utility_type: '',
    status: '',
    page: 1,
    per_page: 10,
})

const isLoading = computed(() => utilityReadingStore.isLoading);
const hasError = computed(() => utilityReadingStore.hasError);

const handlePageChange = (page) => {
    filters.value.page = page;
    fectUtilities();
};

const rowsPerPageChange = (per_page) => {
    filters.value.per_page = per_page
    fectUtilities();
};

const onFilter = () => {
    filters.value.page = 1;
    fectUtilities();
}

const fectUtilities = async () => {
    const params = { ...filters.value }
    await utilityReadingStore.getList(
        selectedBuildingId.value,
        params.page,
        params.per_page,
        params.period,
        params.utility_type,
        params.status,
    )
}

// Formatters
const formatNumber = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value || 0)
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value || 0)
}

const getStatusColor = (status) => {
    const colors = {
        pending: 'warning',
        confirmed: 'success',
        billed: 'secondary'
    }
    return colors[status] || 'secondary'
}

const getStatusText = (status) => {
    const texts = {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        billed: 'Đã tính phí'
    }
    return texts[status] || status
}

onMounted(async () => {
    await fectUtilities()
})
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
