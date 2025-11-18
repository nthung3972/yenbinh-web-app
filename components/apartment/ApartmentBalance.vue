<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>
    <div v-else-if="hasError">{{ hasError }}</div>
    <div v-else class="apartment-finance">
        <!-- Thông tin tài chính tổng quan -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-transparent">
                        <h5 class="card-title mb-0">
                            <Icon name="mdi:cash-multiple" size="22" class="me-2" />
                            Tổng quan tài chính
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <!-- Số dư hiện tại -->
                            <div class="col-md-3 col-sm-6 mb-3">
                                <div class="finance-card text-center p-3 rounded"
                                    :class="getBalanceClass(apartmentBalance.current_balance)">
                                    <div class="finance-icon mb-2">
                                        <i class="bx bx-credit-card fs-2"></i>
                                    </div>
                                    <h4 :class="getBalanceTextClass(apartmentBalance.current_balance)">
                                        {{ formatCurrency(apartmentBalance.current_balance) }}
                                    </h4>
                                    <p class="text-muted mb-0">Số dư hiện tại</p>
                                    <small class="text-muted">
                                        Cập nhật: {{ formatDate(apartmentBalance.updated_at) }}
                                    </small>
                                </div>
                            </div>

                            <!-- Tổng đã tính phí -->
                            <div class="col-md-3 col-sm-6 mb-3">
                                <div class="finance-card text-center p-3 rounded bg-light">
                                    <div class="finance-icon mb-2 text-warning">
                                        <i class="bx bx-receipt fs-2"></i>
                                    </div>
                                    <h4 class="text-warning">
                                        {{ formatCurrency(apartmentBalance.total_charged) }}
                                    </h4>
                                    <p class="text-muted mb-0">Tổng đã tính phí</p>
                                    <small class="text-muted">
                                        Cập nhật: {{ formatDate(apartmentBalance.last_charge_date) }}
                                    </small>
                                </div>
                            </div>

                            <!-- Tổng đã tính phí -->
                            <div class="col-md-3 col-sm-6 mb-3">
                                <div class="finance-card text-center p-3 rounded bg-light">
                                    <div class="finance-icon mb-2 text-info">
                                        <i class="bx bx-receipt fs-2"></i>
                                    </div>
                                    <h4 class="text-info">
                                        {{ formatCurrency(Math.abs(adjustmentTotal)) }}
                                    </h4>
                                    <p class="text-muted mb-0">Điều chỉnh {{ adjustmentTotal > 0 ? 'tăng' : 'giảm'}}</p>
                                    <small class="text-muted">
                                        Cập nhật: {{ formatDate(apartmentBalance.updated_at) }}
                                    </small>
                                </div>
                            </div>

                            <!-- Tổng đã thanh toán -->
                            <div class="col-md-3 col-sm-6 mb-3">
                                <div class="finance-card text-center p-3 rounded bg-light">
                                    <div class="finance-icon mb-2 text-success">
                                        <i class="bx bx-check-circle fs-2"></i>
                                    </div>
                                    <h4 class="text-success">
                                        {{ formatCurrency(apartmentBalance.total_paid) }}
                                    </h4>
                                    <p class="text-muted mb-0">Tổng đã thanh toán</p>
                                    <small class="text-muted">
                                        Cập nhật: {{ formatDate(apartmentBalance.last_payment_date) }}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lịch sử biến động tài chính -->
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header bg-transparent d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">
                            <Icon name="mdi:trending-up" size="22" class="me-2" />
                            Lịch sử biến động tài chính
                        </h5>

                        <!-- Bộ lọc -->
                        <div class="d-flex gap-2">
                            <select class="form-select form-select-sm" v-model="filterTransactionType"
                                style="width: 150px;">
                                <option value="">Tất cả loại</option>
                                <option value="charge">Tính phí</option>
                                <option value="payment">Thanh toán</option>
                                <option value="adjustment">Điều chỉnh</option>
                            </select>

                            <input type="date" class="form-control form-control-sm" v-model="filterDate"
                                style="width: 150px;">
                        </div>
                    </div>

                    <div class="card-body">
                        <!-- Thống kê nhanh -->
                        <div class="row mb-3">
                            <div class="col-md-3">
                                <div class="d-flex align-items-center">
                                    <span class="badge bg-danger me-2">+</span>
                                    <small class="text-muted">Tổng phí: {{ formatCurrency(statistics.income) }}</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="d-flex align-items-center">
                                    <span class="badge bg-success me-2">-</span>
                                    <small class="text-muted">Đã thu: {{ formatCurrency(statistics.expense) }}</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="d-flex align-items-center">
                                    <span class="badge bg-info me-2">{{ statistics.adjustment > 0 ? '+' : '-' }}</span>
                                    <small class="text-muted">Điều chỉnh: {{ formatCurrency(statistics.adjustment) }}</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <small class="text-muted">Tổng giao dịch: {{ statistics.totalTransactions }}</small>
                            </div>
                            <!-- <div class="col-md-3 text-end">
                                <button class="btn btn-sm btn-outline-primary" @click="exportTransactions">
                                    <i class="bx bx-export me-1"></i>
                                    Xuất Excel
                                </button>
                            </div> -->
                        </div>

                        <!-- Danh sách biến động -->
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 13%;">Ngày giao dịch</th>
                                        <th style="width: 9%;">Loại</th>
                                        <th style="width: 13%;">Số tiền</th>
                                        <th style="width: 10%;">Số dư trước</th>
                                        <th style="width: 10%;">Số dư sau</th>
                                        <th>Mô tả</th>
                                        <th style="width: 8%;">Người tạo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="transaction in filteredTransactions" :key="transaction.id">
                                        <td>
                                            <div class="fw-semibold">{{ formatDateTime(transaction.created_at) }}</div>
                                            <small class="text-muted">{{ timeAgo(transaction.created_at) }}</small>
                                        </td>
                                        <td>
                                            <span class="badge"
                                                :class="getTransactionTypeBadgeClass(transaction.transaction_type)">
                                                {{ getTransactionTypeText(transaction.transaction_type) }}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <span class="badge"
                                                    :class="getAmountBadgeClass(transaction.transaction_type)">
                                                </span>
                                                <strong :class="getAmountTextClass(transaction.transaction_type)">
                                                    {{ formatCurrency(transaction.amount) }}
                                                </strong>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="text-muted">{{ formatCurrency(transaction.balance_before)
                                                }}</span>
                                        </td>
                                        <td>
                                            <strong>{{ formatCurrency(transaction.balance_after) }}</strong>
                                        </td>
                                        <td>
                                            <div>{{ transaction.description }}</div>
                                            <small v-if="transaction.reference_id" class="text-muted">
                                                Mã: {{ transaction.reference_id }}
                                            </small>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <i class="bx bx-user me-1"></i>
                                                <span>{{ transaction.created_by.name }}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Phân trang -->
                        <Pagination :pagination="pagination" @page-change="handlePageChange"
                            @rows-per-page-change="rowsPerPageChange" />

                        <!-- Trạng thái không có dữ liệu -->
                        <div v-if="filteredTransactions.length === 0" class="text-center py-5">
                            <i class="bx bx-history fs-1 text-muted mb-3"></i>
                            <p class="text-muted">Không có giao dịch nào được tìm thấy</p>
                            <button class="btn btn-primary btn-sm" @click="resetFilters">
                                <i class="bx bx-refresh me-1"></i>
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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

// Dữ liệu tài chính căn hộ
const apartmentBalance = ref({})

// Dữ liệu biến động tài chính
const transactions = ref([])

//state store
const apartmentStore = useApartmentStore()
const pagination = ref({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
})
const isLoading = ref(false)
const hasError = ref(null)

//filter
const filterTransactionType = ref('')
const filterReferenceType = ref('')
const filterDate = ref('')
const filters = ref({
    page: 1,
    per_page: 10,
})

// Computed properties
const filteredTransactions = computed(() => {
    return transactions.value.filter(transaction => {
        const matchesType = !filterTransactionType.value || transaction.transaction_type === filterTransactionType.value
        const matchesReference = !filterReferenceType.value || transaction.reference_type === filterReferenceType.value
        const matchesDate = !filterDate.value || transaction.created_at.startsWith(filterDate.value)

        return matchesType && matchesReference && matchesDate
    })
})

const statistics = computed(() => {
    const filtered = filteredTransactions.value
    return {
        income: filtered
            .filter(t => parseFloat(t.amount) > 0 && t.reference_type === 'invoice')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0),
        adjustment: filtered
            .filter(t => parseFloat(t.amount) && t.reference_type === 'adjustment')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0),
        expense: Math.abs(filtered
            .filter(t => parseFloat(t.amount) < 0 && t.reference_type === 'payment')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0)),
        totalTransactions: filtered.length
    }
})

const adjustmentTotal = computed(() => {
    const total = transactions.value
    return total.filter(t => parseFloat(t.amount) && t.reference_type === 'adjustment')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
})

// Methods
const fetchApartmentBalance = async () => {
    isLoading.value = true
    try {
        const params = { ...filters.value }
        const result = await apartmentStore.apartmentBalance(
            props.apartmentId,
            params.page,
            params.per_page,
        )
        if (result) {
            apartmentBalance.value = result.apartmentBalance
            transactions.value = result.apartmentTransactions.data
            pagination.value = {
                current_page: result.apartmentTransactions.current_page,
                per_page: result.apartmentTransactions.per_page,
                total: result.apartmentTransactions.total,
                last_page: result.apartmentTransactions.last_page,
            };
        }
    } catch (err) {
        hasError.value = err
    } finally {
        isLoading.value = false
    }
}

const handlePageChange = (page) => {
    filters.value.page = page
    fetchApartmentBalance()
};

const rowsPerPageChange = (per_page) => {
    filters.value.per_page = per_page
    fetchApartmentBalance()
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount)
}

const formatDate = (dateString) => {
    if (!dateString) return '--'
    return new Date(dateString).toLocaleDateString('vi-VN')
}

const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('vi-VN')
}

const timeAgo = (dateTimeString) => {
    const date = new Date(dateTimeString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    return `${diffDays} ngày trước`
}

const getBalanceClass = (balance) => {
    return balance >= 0 ? 'bg-success-light' : 'bg-danger-light'
}

const getBalanceTextClass = (balance) => {
    return balance >= 0 ? 'text-success' : 'text-danger'
}

const getBalanceBadgeClass = (balance) => {
    return balance >= 0 ? 'bg-success' : 'bg-danger'
}

const getBalanceStatus = (balance) => {
    return balance >= 0 ? 'Dư có' : 'Dư nợ'
}

const getBalanceDescription = (balance) => {
    return balance >= 0 ? 'Số dư dương' : 'Cần thanh toán'
}

const getTrendingIconClass = (balance) => {
    return balance >= 0 ? 'text-success' : 'text-danger'
}

const getTransactionTypeBadgeClass = (type) => {
    const classes = {
        charge: 'bg-danger',
        payment: 'bg-success',
        adjustment: 'bg-info'
    }
    return classes[type] || 'bg-secondary'
}

const getTransactionTypeText = (type) => {
    const texts = {
        charge: 'Tính phí',
        payment: 'Thanh toán',
        adjustment: 'Điều chỉnh',
        refund: 'Hoàn tiền'
    }
    return texts[type] || type
}

const getAmountBadgeClass = (type) => {
    if (type === 'charge') {
        return 'bg-danger'
    }
    else if (type === 'payment') {
        return 'bg-success'
    }
    else if (type === 'adjustment') {
        return 'bg-info'
    }
}

const getAmountTextClass = (type) => {
    if (type === 'charge') {
        return 'text-danger'
    }
    else if (type === 'payment') {
        return 'text-success'
    }
    else if (type === 'adjustment') {
        return 'text-info'
    }
}

const exportTransactions = () => {
    console.log('Xuất Excel')
    // Implement export functionality
}

const resetFilters = () => {
    filterTransactionType.value = ''
    filterReferenceType.value = ''
    filterDate.value = ''
}

onMounted(() => {
    fetchApartmentBalance()
})
</script>

<style scoped>
.finance-card {
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
}

.finance-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.bg-success-light {
    background-color: rgba(25, 135, 84, 0.1) !important;
}

.bg-danger-light {
    background-color: rgba(220, 53, 69, 0.1) !important;
}

.finance-icon {
    opacity: 0.8;
}

.table th {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6c757d;
}

.badge {
    font-size: 0.75rem;
}
</style>
