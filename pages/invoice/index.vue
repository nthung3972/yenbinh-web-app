<template>
    <div class="card shadow-sm p-4">

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
                    <Icon name="fa6-solid:file-invoice-dollar" size="24" /> Danh sách hóa đơn
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
                        class="btn btn-primary d-flex align-items-center justify-content-center"
                        style="white-space: nowrap;">
                        <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" />
                        Tạo hóa đơn
                    </NuxtLink>
                </div>
            </div>

            <!-- Bộ lọc -->
            <div class="card mb-4 border shadow-sm">
                <div class="card-body">
                    <div class="row row-cols-1 row-cols-md-auto g-3 align-items-end">
                        <!-- Trạng thái -->
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">Trạng thái</label>
                            <select v-model="filters.status" @change="onFilter" class="form-select">
                                <option value="">Tất cả</option>
                                <option :value="0">Chưa thanh toán</option>
                                <option :value="1">Đã thanh toán</option>
                                <option :value="3">Chưa thanh toán hết</option>
                                <option :value="2">Đã quá hạn</option>
                            </select>
                        </div>

                        <!-- Từ ngày -->
                        <div class="col-md-2">
                            <label class="form-label fw-semibold">Từ ngày</label>
                            <input type="date" v-model="filters.invoice_date_from" @change="handleDateChange"
                                class="form-control" />
                        </div>

                        <!-- Đến ngày -->
                        <div class="col-md-2">
                            <label class="form-label fw-semibold">Đến ngày</label>
                            <input type="date" v-model="filters.invoice_date_to" @change="handleDateChange"
                                class="form-control" />
                        </div>
                    </div>
                </div>
            </div>

            <table class="table table-hover align-middle" style="table-layout: fixed; width: 100%;">
                <thead class="table-light sticky-top" style="z-index: 1;">
                    <tr>
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
                            <div class="btn-group gap-2">
                                <NuxtLink :to="`/invoice/detail/${invoice.invoice_id}`"
                                    class="btn btn-sm btn-outline-success d-flex align-items-center px-3 py-2">
                                    <Icon name="bxs:detail" size="16" class="me-1" /> Xem
                                </NuxtLink>

                                <button class="btn btn-sm btn-outline-primary d-flex align-items-center px-3 py-2"
                                    :disabled="invoice.status === 1"
                                    :title="invoice.status === 1 ? 'Hóa đơn đã thanh toán, không thể thêm' : 'Thêm thanh toán'"
                                    @click="openPaymentModal(invoice)">
                                    <Icon name="bxs:wallet" size="16" class="me-1" />
                                    Thanh toán
                                </button>

                                <NuxtLink :to="invoice.status !== 1 ? `/invoice/edit/${invoice.invoice_id}` : '#'"
                                    :class="[
                                        'btn', 'btn-sm', 'btn-outline-warning',
                                        'd-flex', 'align-items-center',
                                        { 'disabled opacity-50': invoice.status === 1 }
                                    ]"
                                    :title="invoice.status === 1 ? 'Báo cáo không thể chỉnh sửa vì trạng thái không phải draft' : 'Chỉnh sửa báo cáo'"
                                    @click.prevent="invoice.status === 1 ? null : undefined">
                                    <Icon name="bxs:edit-alt" size="16" class="me-1" /> Sửa
                                </NuxtLink>

                                <button v-if="authStore.isAdmin" type="button" class="btn btn-sm btn-outline-danger d-flex align-items-center px-3 py-2"
                                    @click="setSelectedInvoice(invoice.invoice_id)">
                                    <Icon name="material-symbols:delete-outline" size="16" class="me-1" /> Xóa
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination :pagination="useInvoice.pagination" @page-change="handlePageChange" @rows-per-page-change="rowsPerPageChange"/>
        </div>
    </div>

     <!-- Modal -->
     <InvoicePaymentModal
      v-model="showModal"
      :invoice="selectedInvoice"
      @submitted="handlePaymentSubmitted"
    />

    <ConfirmModal v-model="showDeleteModal" title="Xác nhận xóa hóa đơn"
        :message="`Bạn có chắc chắn muốn xóa hóa đơn này không?`" confirmText="Xóa" @confirm="deleteInvoice" />
</template>

<script setup>
import { onMounted } from 'vue'
import { useInvoiceStore } from '@/stores/invoice'
import { useAuthStore } from '@/stores/auth'
import Pagination from '@/components/pagination/Pagination.vue'
import InvoicePaymentModal from '@/components/modal/InvoicePaymentModal.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import { useToast } from 'vue-toastification'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const useInvoice = useInvoiceStore()
const authStore = useAuthStore()
const { formatVND } = useCurrencyFormat()
const showModal = ref(false)
const selectedInvoice = ref(null)
const showDeleteModal = ref(false)
const invoice_id = ref(null)
const toast = useToast()

function openPaymentModal(invoice) {
  selectedInvoice.value = invoice
  showModal.value = true
}

function handlePaymentSubmitted() {
  loadInvoices()
}

const setSelectedInvoice = (id) => {
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

const loadInvoices = () => {
    const params = { ...filters.value }
    useInvoice.fetchtInvoiceList(
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
.d-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
</style>
