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
                    <Icon name="fa6-solid:file-invoice-dollar" size="28" class="me-2" /> Danh sách hóa đơn
                </h5>

                <div class="d-flex align-items-center gap-3">
                    <div class="d-flex align-items-center gap-3">
                        <!-- Ô tìm kiếm -->
                        <div class="input-group">
                            <span class="input-group-text bg-white">
                                <Icon name="material-symbols:search" />
                            </span>
                            <input v-model="filters.key_search" @keyup.enter="onSearch" type="text" class="form-control"
                                placeholder="Nhập tên căn hộ..." />
                            <button class="btn btn-outline-primary" @click="onSearch">
                                Tìm
                            </button>
                        </div>
                    </div>
                    <NuxtLink to="/invoice/create"
                        class="btn btn-success d-flex align-items-center justify-content-center"
                        style="white-space: nowrap;">
                        <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" />
                        Tạo hóa đơn
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
                        <!-- Trạng thái -->
                        <div class="col-md-3">
                            <div class="form-label-group">
                                <select v-model="filters.status" @change="onFilter" class="form-select">
                                    <option value="">Tất cả</option>
                                    <option :value="0">Chưa thanh toán</option>
                                    <option :value="1">Đã thanh toán</option>
                                    <option :value="3">Chưa thanh toán hết</option>
                                    <option :value="2">Đã quá hạn</option>
                                </select>
                                <label for="typeSelect">Trạng thái<span class="required-mark"></span></label>
                            </div>
                        </div>

                        <!-- Từ ngày -->
                        <div class="col-md-2">
                            <div class="form-label-group">
                                <input type="date" v-model="filters.invoice_date_from" @change="handleDateChange"
                                    class="form-select" />
                                <label class="form-label fw-semibold">Từ ngày</label>
                            </div>
                        </div>

                        <!-- Đến ngày -->
                        <div class="col-md-2">
                            <div class="form-label-group">
                                <input type="date" v-model="filters.invoice_date_to" @change="handleDateChange"
                                    class="form-select" />
                                <label class="form-label fw-semibold">Từ ngày</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <table class="table table-hover align-middle" style="table-layout: fixed; width: 100%;">
                <thead class="table-primary sticky-top" style="z-index: 1;">
                    <tr>
                        <th style="width: 5%;">#</th>
                        <th style="width: 10%;">Mã căn hộ</th>
                        <th style="width: 10%;">Tổng tiền (VNĐ)</th>
                        <th style="width: 14%;">Ngày ban hành</th>
                        <th style="width: 14%;">Đã thanh toán (VNĐ)</th>
                        <th style="width: 10%;">Trạng thái</th>
                        <th style="width: 10%;">Người tạo</th>
                        <th style="width: 27%; text-align: center;">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(invoice, index) in useInvoice.invoiceList" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ invoice.apartment.apartment_number }}</td>
                        <td>{{ formatVND(invoice.total_amount) }}</td>
                        <td>{{ invoice.invoice_date }}</td>
                        <td>{{ formatVND(invoice.total_paid) }}</td>
                        <td>
                            <span :class="[
                                'badge',
                                invoice.status === 0 ? 'bg-warning'
                                    : invoice.status === 1 ? 'bg-success'
                                        : invoice.status === 2 ? 'bg-danger'
                                            : 'bg-primary'
                            ]">
                                {{ invoice.status === 0 ? 'Chưa thanh toán'
                                    : invoice.status === 1 ? 'Đã thanh toán'
                                        : invoice.status === 2 ? 'Đã quá hạn'
                                            : 'Thanh toán một phần' }}
                            </span>
                        </td>
                        <td>{{ invoice.updated_by?.name ?? '----' }}</td>
                        <td class="text-center">
                            <ActionDropdown buttonText="Thao tác" iconName="bx:chevron-down">
                                <template #default="{ closeDropdown }">
                                    <DropdownItem tag="NuxtLink" :to="`/invoice/detail/${invoice.invoice_id}`"
                                        iconName="bxs:detail">
                                        Xem
                                    </DropdownItem>

                                    <DropdownItem :disabled="invoice.status === 1"
                                        :title="invoice.status === 1 ? 'Hóa đơn đã thanh toán, không thể thêm' : 'Thêm thanh toán'"
                                        iconName="bxs:wallet" :onClick="() => openPaymentModal(invoice)"
                                        :onClose="closeDropdown">
                                        Thanh toán
                                    </DropdownItem>

                                    <DropdownItem tag="NuxtLink"
                                        :to="invoice.status !== 1 ? `/invoice/edit/${invoice.invoice_id}` : '#'"
                                        :disabled="invoice.status === 1"
                                        :title="invoice.status === 1 ? 'Báo cáo không thể chỉnh sửa vì trạng thái không phải draft' : 'Chỉnh sửa báo cáo'"
                                        iconName="bxs:edit-alt">
                                        Sửa
                                    </DropdownItem>

                                    <DropdownItem v-if="authStore.isAdmin" iconName="material-symbols:delete-outline"
                                        :onClick="() => setSelectedInvoice(invoice.invoice_id)"
                                        :onClose="closeDropdown">
                                        Xóa
                                    </DropdownItem>
                                </template>
                            </ActionDropdown>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination :pagination="useInvoice.pagination" @page-change="handlePageChange"
                @rows-per-page-change="rowsPerPageChange" />
        </div>
    </div>

    <!-- Modal -->
    <InvoicePaymentModal v-model="showModal" :invoice="selectedInvoice" @submitted="handlePaymentSubmitted" />

    <ConfirmModal v-model="showDeleteModal" title="Xác nhận xóa hóa đơn"
        :message="`Bạn có chắc chắn muốn xóa hóa đơn này không?`" confirmText="Xóa" @confirm="deleteInvoice" />
</template>

<script setup>
import { onMounted } from 'vue'
import { useInvoiceStore } from '@/stores/invoice'
import { useAuthStore } from '@/stores/auth'
import Pagination from '@/components/pagination/Pagination.vue'
import ActionDropdown from '@/components/dropdown/actionDropdown.vue'
import DropdownItem from '@/components/dropdown/dropdownItem.vue'
import InvoicePaymentModal from '@/components/modal/InvoicePaymentModal.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import { useToast } from 'vue-toastification'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const useInvoice = useInvoiceStore()
const authStore = useAuthStore()
const showModal = ref(false)
const selectedInvoice = ref(null)
const showDeleteModal = ref(false)
const invoice_id = ref(null)
const toast = useToast()

const { formatVND } = useCurrencyFormat()

function openPaymentModal(invoice) {
    selectedInvoice.value = invoice
    showModal.value = true
}

function handlePaymentSubmitted() {
    loadInvoices()
}

const setSelectedInvoice = async (id) => {
    invoice_id.value = id;
    showDeleteModal.value = true
}

const filters = ref({
    invoice_date_from: '',
    invoice_date_to: '',
    status: '',
    key_search: '',
    page: 1,
    per_page: 10,
})

const isLoading = computed(() => useInvoice.isLoading);
const hasError = computed(() => useInvoice.hasError);

const handlePageChange = (page) => {
    filters.value.page = page
    loadInvoices();
};

const rowsPerPageChange = (per_page) => {
    filters.value.per_page = per_page
    loadInvoices();
};

const onSearch = () => {
    filters.value.page = 1
    loadInvoices();
};

const onFilter = () => {
    filters.value.page = 1
    loadInvoices()
}

const handleDateChange = () => {
    filters.value.page = 1
    loadInvoices()
}

const loadInvoices = async() => {
    const params = { ...filters.value }
    await useInvoice.fetchtInvoiceList(
        params.page,
        params.per_page,
        params.key_search,
        params.status,
        params.invoice_date_from,
        params.invoice_date_to
    )
}

const deleteInvoice = async () => {
    try {
        const result = await useInvoice.deleteInvoice(invoice_id.value)
        if (result) {
            toast.success("Xóa hóa đơn thành công!")
            loadInvoices
        }
    } catch (error) {
        toast.error(error.message || "Lỗi khi xóa hóa đơn!");
    }
}

onMounted(loadInvoices)
</script>

<style scoped>
/* CSS cho dropdown menu thao tác */
.action-dropdown {
    position: relative;
    display: inline-block;
}

.action-dropdown .dropdown-menu {
    min-width: 160px;
    position: absolute;
    right: 0;
    left: auto;
    z-index: 1000;
    display: none;
    float: left;
    padding: 0.5rem 0;
    margin: 0.125rem 0 0;
    font-size: 0.875rem;
    color: #212529;
    text-align: left;
    list-style: none;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.25rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
}

.action-dropdown .dropdown-menu.show {
    display: block;
}

.action-dropdown .dropdown-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.5rem 1.5rem;
    clear: both;
    font-weight: 400;
    color: #212529;
    text-align: inherit;
    white-space: nowrap;
    background-color: transparent;
    border: 0;
    text-decoration: none;
}

.action-dropdown .dropdown-item:hover,
.action-dropdown .dropdown-item:focus {
    color: #16181b;
    text-decoration: none;
    background-color: #f8f9fa;
}

.action-dropdown .dropdown-item.disabled {
    color: #6c757d;
    pointer-events: none;
    background-color: transparent;
    cursor: not-allowed;
    opacity: 0.65;
}

.action-dropdown .dropdown-item:active {
    color: #fff;
    text-decoration: none;
    background-color: #0d6efd;
}

/* Nút toggle dropdown */
.action-btn {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #495057;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 120px;
}

.action-btn:hover {
    background-color: #e9ecef;
}

/* Style cho icons trong dropdown */
.dropdown-item i,
.dropdown-item svg {
    margin-right: 0.5rem;
}

/* Separator giữa các items (nếu cần) */
.dropdown-divider {
    height: 0;
    margin: 0.5rem 0;
    overflow: hidden;
    border-top: 1px solid #e9ecef;
}

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
