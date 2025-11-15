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
                    <Icon name="mdi:cash-multiple" size="28" class="me-2" /> Danh mục biểu phí
                </h4>

                <div class="d-flex align-items-center gap-3">
                    <!-- Ô tìm kiếm -->
                    <div class="input-group">
                        <span class="input-group-text bg-white">
                            <Icon name="material-symbols:search" />
                        </span>
                        <input v-model="filters.key_search" @keyup.enter="onSearch" type="text" class="form-control"
                            placeholder="Nhập tên hoặc mã phí..." />
                        <button class="btn btn-outline-primary" @click="onSearch">
                            Tìm
                        </button>
                    </div>
                    <NuxtLink v-if="authStore.isAdmin" to="/building-fee/create"
                        class="btn btn-success d-flex align-items-center justify-content-center"
                        style="white-space: nowrap;">
                        <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" />
                        Thêm phí mới
                    </NuxtLink>
                </div>
            </div>

            <!-- Bộ lọc -->
            <div class="card mb-4 border shadow-sm">
                <div class="card-body">
                    <div class="d-flex mb-3">
                        <h6 class="fw-bold text-info mb-0">
                            <Icon name="codicon:filter-filled" size="18" class="me-1" />Bộ lọc tìm kiếm
                        </h6>
                    </div>

                    <div class="row row-cols-1 row-cols-md-auto g-3 align-items-end">
                        <!-- Trạng thái -->
                        <div class="col-md-3">
                            <div class="form-label-group">
                                <select v-model="filters.fee_types_id" @change="onFilter" class="form-select">
                                    <option value="">Tất cả loại phí</option>
                                    <option v-for="feeType in feeTypeStore.feeTypes" :key="feeType.fee_types_id" :value="feeType.fee_types_id">
                                        {{ feeType.name }}
                                    </option>
                                </select>
                                <label for="typeSelect">Trạng thái<span class="required-mark"></span></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <table class="table table-hover align-middle" style="table-layout: fixed; width: 100%;">
                <thead class="table-primary sticky-top" style="z-index: 1;">
                    <tr>
                        <th style="width: 5%;">#</th>
                        <th style="width: 20%;">Loại phí</th>
                        <th style="width: 15%;">Tên phí</th>
                        <th style="width: 10%;">Giá dịch vụ</th>
                        <th style="width: 10%;">Đơn vị</th>
                        <th style="width: 10%;">Ngày áp dụng</th>
                        <th style="width: 10%;">Ngày kết thúc</th>
                        <th v-if="authStore.isAdmin" style="width: 20%; text-align: center;">Hành động</th>
                    </tr>
                </thead>
                <tbody v-if="buildingFeeStore.buildingFees.length > 0">
                    <tr v-for="(buildingFee, index) in buildingFeeStore.buildingFees" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ buildingFee.fee_type?.name }}</td>
                        <td>{{ buildingFee.fee_subtype?.name }}</td>
                        <td>{{ formatPrice(buildingFee.price) }}</td>
                        <td>{{ buildingFee.unit }}</td>
                        <td>{{ buildingFee.effective_from }}</td>
                        <td>{{ buildingFee.effective_to ?? '---' }}</td>

                        <td class="text-center" v-if="authStore.isAdmin">
                            <ActionDropdown buttonText="Thao tác" iconName="bx:chevron-down">
                                <template #default="{ closeDropdown }">
                                    <DropdownItem tag="NuxtLink" :to="`/building-fee/edit/${buildingFee.building_fee_id}`"
                                        iconName="bxs:edit-alt">
                                        Sửa
                                    </DropdownItem>
                                </template>
                            </ActionDropdown>
                        </td>
                    </tr>
                </tbody>

                <tbody v-else>
                    <tr>
                        <td colspan="8" class="text-center py-4">
                            <p class="mb-0 text-muted">Chưa có biểu phí hoặc không tìm thấy biểu phí phù hợp.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination :pagination="buildingFeeStore.pagination" @page-change="handlePageChange"
                @rows-per-page-change="rowsPerPageChange" />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useBuildingFeeStore } from '@/stores/building-fee'
import Pagination from '@/components/pagination/Pagination.vue'
import ActionDropdown from '@/components/dropdown/actionDropdown.vue'
import DropdownItem from '@/components/dropdown/dropdownItem.vue'
import { useInitialData } from '@/composables/useInitialData'
import { useFeeTypeStore } from '@/stores/fee-type'
import { formatPrice } from '@/composables/priceFormatter'
import { useAuthStore } from '@/stores/auth'

definePageMeta({
    middleware: "auth",
    layout: "dashboard",
    breadcrumb: 'Biểu phí tòa nhà',
})

const buildingFeeStore = useBuildingFeeStore();
const feeTypeStore = useFeeTypeStore()
const authStore = useAuthStore()

const { selectedBuildingId } = useInitialData();

const filters = ref({
    building_id: selectedBuildingId.value,
    fee_types_id: '',
    key_search: '',
    page: 1,
    per_page: 10,
})

const isLoading = computed(() => buildingFeeStore.isLoading);
const hasError = computed(() => buildingFeeStore.hasError);

const fetchFeeTypes = async () => {
    await feeTypeStore.getFeeTypes()
}

const fetchBuildingFees = async () => {
    const params = { ...filters.value }
    // console.log('Fetching with params:', params);
    await buildingFeeStore.getBuildingFees(
        params.building_id,
        params.page,
        params.per_page,
        params.key_search,
        params.fee_types_id
    )
}

const handlePageChange = (page) => {
    currentPage.value = page;
    fetchBuildingFees();
};

const rowsPerPageChange = (per_page) => {
    filters.value.per_page = per_page
    fetchBuildingFees();
};

const onSearch = () => {
    filters.value.page = 1
    fetchBuildingFees();
};

const onFilter = () => {
    filters.value.page = 1
    fetchBuildingFees();
}

onMounted(() => {
    fetchBuildingFees();
    fetchFeeTypes();
});
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
