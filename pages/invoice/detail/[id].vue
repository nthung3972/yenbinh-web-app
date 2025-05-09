<template>
  <div v-if="isLoading" class="text-center">
    <div class="spinner-border spinner-border-sm me-2" role="status">
      <span class="visually-hidden">Đang tải dữ liệu...</span>
    </div>
    <p>Đang tải dữ liệu...</p>
  </div>
  <div v-else-if="hasError">{{ hasError }}</div>

  <div v-else class="container mt-5">
    <div class="invoice-display">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold text-primary">
          <Icon name="mdi:receipt-text" size="24" class="me-2" />
          Hóa Đơn Chi Tiết
        </h3>
        <button class="btn btn-outline-secondary" @click="goBack">
          <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
          Quay lại
        </button>
      </div>

      <!-- Invoice Card -->
      <div class="card shadow-lg border-0">
        <div class="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
          <span class="fw-semibold">
            <Icon name="mdi:home-city" size="20" class="me-2 text-white" />
            Mã Căn Hộ: {{ invoiceStore.invoice.apartment_number }}
          </span>
          <button @click="downloadInvoice(id)" class="btn btn-success" :disabled="loading">
            <Icon name="mdi:file-excel" class="me-1" />
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? "Đang xử lý..." : "Xuất excel" }}
          </button>
        </div>

        <div class="card-body p-4">
          <!-- Thông tin hóa đơn -->
          <div class="row mb-4">
            <div class="col-md-4">
              <p class="mb-2">
                <strong>Ngày Phát Hành:</strong> {{ formatDate(invoiceStore.invoice.invoice_date) }}
              </p>
            </div>
            <div class="col-md-4">
              <p class="mb-2">
                <strong>Hạn Thanh Toán:</strong> {{ formatDate(invoiceStore.invoice.due_date) }}
              </p>
            </div>
            <div class="col-md-4">
              <p class="mb-2">
                <strong>Người tạo: </strong> {{ invoiceStore.invoice.updated_by ? invoiceStore.invoice.updated_by :
                  '----' }}
              </p>
            </div>
            <div class="col-md-4">
              <p class="mb-2">
                <strong>Đã thanh toán:</strong> {{ formatVND(invoiceStore.invoice.total_paid) }}
              </p>
            </div>
            <div class="col-md-4">
              <p class="mb-2">
                <strong>Còn lại:</strong> {{ formatVND(invoiceStore.invoice.remaining_balance) }}
              </p>
            </div>
            <div class="col-md-4">
              <p class="mb-2">
                <strong>Trạng thái: </strong>
                <span :class="['badge', getStatusBadgeClass(invoiceStore.invoice.status)]">
                  {{ getStatusText(invoiceStore.invoice.status) }}
                </span>
              </p>
            </div>
          </div>

          <!-- Chi tiết các khoản phí -->
          <div class="invoice-details bg-light p-3 rounded">
            <h5 class="fw-semibold text-dark mb-3">
              <Icon name="mdi:format-list-checks" size="20" class="me-2" />
              Các Khoản Phí
            </h5>
            <div class="table-responsive">
              <table class="table table-borderless table-hover">
                <thead class="table-light">
                  <tr>
                    <th style="width: 20%;">
                      <Icon name="mdi:file-document" size="16" class="me-2" />
                      Loại Phí
                    </th>
                    <th style="width: 15%;">
                      <Icon name="mdi:numeric" size="16" class="me-2" />
                      Số Lượng
                    </th>
                    <th style="width: 15%;">
                      <Icon name="mdi:currency-usd" size="16" class="me-2" />
                      Đơn Giá
                    </th>
                    <th style="width: 15%;">
                      <Icon name="mdi:cash-multiple" size="16" class="me-2" />
                      Thành Tiền
                    </th>
                    <th style="width: 45%;">
                      <Icon name="mdi:file-document" size="16" class="me-2" />
                      Ghi chú
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(detail, index) in invoiceStore.invoice.invoice_details" :key="index">
                    <td>{{ detail.fee_name }}</td>
                    <td>
                      <span>
                        {{ detail.fee_types.is_fixed === 0 ? detail.quantity : 'Phí cố định' }}
                      </span>
                    </td>
                    <td>
                      <span>
                        {{ detail.fee_types.is_fixed === 0 ? formatVND(detail.price) : 'Phí cố định' }}
                      </span>
                    </td>
                    <td>{{ formatVND(detail.amount) }}</td>
                    <td>{{ detail.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Tổng tiền -->
            <div class="text-end mt-4">
              <h4 class="fw-bold text-success">
                <Icon name="mdi:cash-register" size="20" class="me-2" />
                Tổng Tiền: {{ formatVND(invoiceStore.invoice.total_amount) }}
              </h4>
            </div>

            <!-- Lịch sử thanh toán -->
            <div class="mt-5">
              <h5 class="fw-semibold text-dark mb-3">
                <Icon name="mdi:history" size="20" class="me-2" />
                Lịch Sử Thanh Toán
              </h5>
              <table class="table table-bordered">
                <thead class="table-light">
                  <tr>
                    <th>Ngày Thanh Toán</th>
                    <th>Số Tiền</th>
                    <th>Phương Thức</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(payment, index) in invoiceStore.invoice.payments" :key="index">
                    <td>{{ formatDate(payment.payment_date) }}</td>
                    <td>{{ formatVND(payment.amount) }}</td>
                    <td>{{ getPaymentMethodText(payment.payment_method) }}</td>
                    <td>{{ payment.notes || '---' }}</td>
                  </tr>
                  <tr v-if="!invoiceStore.invoice.payments?.length">
                    <td colspan="4" class="text-center">Chưa có thanh toán nào</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="card-footer text-muted text-center">
          <small>
            <Icon name="mdi:information" size="16" class="me-1" />
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useInvoiceStore } from '@/stores/invoice'
import { useAuthStore } from "~/stores/auth"
import { useExportStore } from '@/stores/export'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'



definePageMeta({
  middleware: "auth",
  layout: "dashboard"
})

const invoiceStore = useInvoiceStore()
const exportStore = useExportStore()
const isLoading = computed(() => invoiceStore.isLoading);
const hasError = computed(() => invoiceStore.hasError);
const route = useRoute()
const router = useRouter()
const id = route.params.id
const authStore = useAuthStore();
const loading = ref(false)

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 0: return 'bg-warning text-dark' // vàng
    case 1: return 'bg-success'           // xanh
    case 2: return 'bg-danger'
    case 3: return 'bg-primary'           // đỏ
    default: return 'bg-secondary'        // xám
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 0: return 'Chưa thanh toán'
    case 1: return 'Đã thanh toán'
    case 2: return 'Đã quá hạn'
    case 3: return 'Thanh toán một phần'
    default: return 'Không xác định'
  }
}

const getPaymentMethodText = (payment_method) => {
  switch (payment_method) {
    case 'cash': return 'Tiền mặt'
    case 'bank_transfer': return 'Chuyển khoản'
    case 'qr_code': return 'QR code'
    case 'other': return 'Phương thức khác'
    default: return 'Không xác định'
  }
}

const downloadInvoice = async (id) => {
  loading.value = true
  try {
    const response = await axios.get(
      `https://api.yenbinhmanagement.vn/api/admin/export/invoices/${id}`, // Thay bằng đúng URL của bạn
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          Authorization: `Bearer ${authStore.token}`, // Nếu có
        }
      }
    )

    // Tạo URL tải file
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'hoa_don_40.xlsx'
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
  } catch (error) {
    console.error('Export error:', error)
  } finally {
    loading.value = false
  }
};

const goBack = () => {
  router.back()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("vi-VN");
}

const formatVND = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

const loadInvoice = async () => {
  await invoiceStore.fetchInvoice(id)
  console.log(invoiceStore.invoice)
}

onMounted(loadInvoice)
</script>

<style scoped>
.card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  border-bottom: none;
}

.table th {
  font-weight: 600;
  color: #555;
}

.table td {
  vertical-align: middle;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.text-primary {
  color: #007bff !important;
}

.text-success {
  color: #28a745 !important;
}

.card-footer {
  background-color: #f1f3f5;
  border-top: none;
}
</style>
