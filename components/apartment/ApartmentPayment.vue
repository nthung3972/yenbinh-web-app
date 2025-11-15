<template>
    <div class="payment-history">
        <!-- Bộ lọc và tìm kiếm -->
        <div class="row mb-4">
            <div class="card-header bg-transparent">
                <h5 class="card-title">
                    <Icon name="mdi:cash-multiple" size="22" class="me-2" />
                    Danh sách hóa đơn
                </h5>
            </div>
            <div class="col-md-3 mt-4">
                <select class="form-select" v-model="filterStatus">
                    <option value="">Tất cả trạng thái</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="partial">Còn nợ</option>
                    <option value="pending">Chờ thanh toán</option>
                    <option value="overdue">Quá hạn</option>
                </select>
            </div>
            <div class="col-md-3 mt-4">
                <select class="form-select" v-model="filterMonth">
                    <option value="">Tất cả tháng</option>
                    <option v-for="month in months" :key="month.value" :value="month.value">
                        {{ month.label }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Danh sách lịch sử thanh toán -->
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-light">
                    <tr>
                        <th style="width: 15%;">Mã hóa đơn</th>
                        <th style="width: 8%;">Kỳ</th>
                        <th style="width: 12%;">Ngày phát hành</th>
                        <th style="width: 12%;">Ngày đến hạn</th>
                        <th style="width: 10%;">Nợ đầu kì</th>
                        <th style="width: 10%;">Nợ cuối kì</th>
                        <th style="width: 10%;">Đã thanh toán</th>
                        <th style="width: 10%;">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="payment in filteredPayments" :key="payment.id">
                        <td>
                            <strong>{{ payment.invoice_number }}</strong>
                        </td>
                        <td>{{ payment.period }}</td>
                        <td>
                            <div>{{ formatDate(payment.issue_date) }}</div>
                        </td>
                        <td>
                            <div>{{ formatDate(payment.due_date) }}</div>
                            <small class="text-muted">{{ daysUntilDue(payment.due_date) }}</small>
                        </td>
                        <td>
                            <div>{{ formatCurrency(payment.opening_balance) }}</div>
                        </td>
                        <td>
                            <div>{{ formatCurrency(payment.total_amount) }}</div>
                        </td>
                        <td>
                            <div>{{ formatCurrency(payment.paid_amount) }}</div>
                        </td>
                        <td>
                            <span class="badge" :class="getStatusBadgeClass(payment.status)">
                                {{ getStatusText(payment.status) }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Phân trang -->
        <Pagination :pagination="pagination" @page-change="handlePageChange"
                            @rows-per-page-change="rowsPerPageChange" />

        <!-- Trạng thái không có dữ liệu -->
        <div v-if="filteredPayments.length === 0" class="text-center py-5">
            <i class="fas fa-receipt fa-3x text-muted mb-3"></i>
            <p class="text-muted">Không có hóa đơn nào được tìm thấy</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApartmentStore } from '@/stores/apartment'
import Pagination from '@/components/pagination/Pagination.vue'

const props = defineProps({
    apartmentId: Number,
})

const apartmentStore = useApartmentStore()

// Dữ liệu mẫu
const payments = ref([])

// State cho bộ lọc
const filterStatus = ref('')
const filterMonth = ref('')
const filters = ref({
    page: 1,
    per_page: 10,
})

const pagination = ref({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
})

// Computed properties
const filteredPayments = computed(() => {
    return payments.value.filter(payment => {
        const matchesStatus = !filterStatus.value || payment.status === filterStatus.value
        const matchesMonth = !filterMonth.value || payment.period.includes(filterMonth.value)

        return matchesStatus && matchesMonth
    })
})

// Danh sách tháng cho filter
const months = ref([
    { value: '1', label: 'Tháng 1' },
    { value: '2', label: 'Tháng 2' },
    { value: '3', label: 'Tháng 3' },
    { value: '4', label: 'Tháng 4' },
    { value: '5', label: 'Tháng 5' },
    { value: '6', label: 'Tháng 6' },
    { value: '7', label: 'Tháng 7' },
    { value: '8', label: 'Tháng 8' },
    { value: '9', label: 'Tháng 9' },
    { value: '10', label: 'Tháng 10' },
    { value: '11', label: 'Tháng 11' },
    { value: '12', label: 'Tháng 12' }
])

// Methods
const fetchApartmentInvoice = async () => {
    const params = { ...filters.value }
    const result = await apartmentStore.apartmentInvoice(
        props.apartmentId,
        params.page,
        params.per_page,
    )
    if (result) {
        payments.value = result.data
        pagination.value = {
            current_page: result.current_page,
            per_page: result.per_page,
            total: result.total,
            last_page: result.last_page,
        };
    }
}

const handlePageChange = (page) => {
    filters.value.page = page
    fetchApartmentInvoice()
};

const rowsPerPageChange = (per_page) => {
    filters.value.per_page = per_page
    fetchApartmentInvoice()
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount)
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
}

const daysUntilDue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 0) {
        return `Còn ${diffDays} ngày`
    } else if (diffDays === 0) {
        return 'Hôm nay'
    } else {
        return `Quá hạn ${Math.abs(diffDays)} ngày`
    }
}

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'paid': return 'bg-success'
        case 'partial': return 'bg-info'
        case 'pending': return 'bg-warning'
        case 'overdue': return 'bg-danger'
        default: return 'bg-secondary'
    }
}

const getStatusText = (status) => {
    switch (status) {
        case 'paid': return 'Đã thanh toán'
        case 'partial': return 'Còn nợ'
        case 'pending': return 'Chờ thanh toán'
        case 'overdue': return 'Quá hạn'
        default: return 'Không xác định'
    }
}

onMounted(() => {
    fetchApartmentInvoice()
})
</script>

<style scoped>
.payment-history {
    margin-top: 1rem;
}

.table th {
    border-top: none;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    color: #6c757d;
}

.card {
    border: none;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.btn-group-sm>.btn {
    padding: 0.25rem 0.5rem;
}
</style>
