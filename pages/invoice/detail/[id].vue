<template>
    <div class="container mt-5">
      <div class="invoice-display">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold text-primary">
            <i class="bi bi-receipt-cutoff me-2"></i>Hóa Đơn Chi Tiết
          </h3>
          <button class="btn btn-outline-secondary" @click="goBack">
            <i class="bi bi-arrow-left-circle me-2"></i>Quay lại
          </button>
        </div>
  
        <!-- Invoice Card -->
        <div class="card shadow-lg border-0">
          <div class="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
            <span class="fw-semibold">
              <i class="bi bi-house-fill me-2"></i>Mã Căn Hộ: {{ invoice.apartment_number }}
            </span>
            <span class="badge bg-light text-primary">
              <i class="bi bi-tag-fill me-1"></i>{{ getStatusText(invoice.status) }}
            </span>
          </div>
  
          <div class="card-body p-4">
            <!-- Thông tin hóa đơn -->
            <div class="row mb-4">
              <div class="col-md-6">
                <p class="mb-2">
                  <i class="bi bi-calendar-event-fill me-2 text-muted"></i>
                  <strong>Ngày Phát Hành:</strong> {{ formatDate(invoice.invoice_date) }}
                </p>
              </div>
              <div class="col-md-6">
                <p class="mb-2">
                  <i class="bi bi-calendar-check-fill me-2 text-muted"></i>
                  <strong>Hạn Thanh Toán:</strong> {{ formatDate(invoice.due_date) }}
                </p>
              </div>
            </div>
  
            <!-- Chi tiết các khoản phí -->
            <div class="invoice-details bg-light p-3 rounded">
              <h5 class="fw-semibold text-dark mb-3">
                <i class="bi bi-list-check me-2"></i>Các Khoản Phí
              </h5>
              <div class="table-responsive">
                <table class="table table-borderless table-hover">
                  <thead class="table-light">
                    <tr>
                      <th><i class="bi bi-card-text me-2"></i>Loại Phí</th>
                      <th><i class="bi bi-hash me-2"></i>Số Lượng</th>
                      <th><i class="bi bi-currency-exchange me-2"></i>Đơn Giá</th>
                      <th><i class="bi bi-wallet2 me-2"></i>Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(detail, index) in invoice.details" :key="index">
                      <td>{{ getServiceName(detail.service_name) }}</td>
                      <td>{{ detail.quantity }}</td>
                      <td>{{ formatVND(detail.price) }}</td>
                      <td>{{ formatVND(detail.amount) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
  
              <!-- Tổng tiền -->
              <div class="text-end mt-4">
                <h4 class="fw-bold text-success">
                  <i class="bi bi-cash-stack me-2"></i>Tổng Tiền: {{ formatVND(invoice.total_amount) }} VNĐ
                </h4>
              </div>
            </div>
          </div>
  
          <!-- Footer -->
          <div class="card-footer text-muted text-center">
            <small><i class="bi bi-info-circle me-1"></i>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</small>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
export default {
  data() {
    return {
      invoice: {
        apartment_number: "A101",
        invoice_date: "2025-04-01",
        due_date: "2025-04-15",
        status: "0",
        total_amount: 3500000,
        details: [
          { service_name: "DIEN", quantity: 150, price: 3000, amount: 450000 },
          { service_name: "NUOC", quantity: 10, price: 15000, amount: 150000 },
          { service_name: "QUANLY", quantity: 1, price: 2000000, amount: 2000000 },
          { service_name: "GUIXE", quantity: 1, price: 900000, amount: 900000 },
        ],
      },
    };
  },
  methods: {
    goBack() {
      // Logic để quay lại trang trước
      this.$router.push("/invoices");
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
    formatVND(amount) {
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    },
    getServiceName(code) {
      const services = {
        DIEN: "Tiền điện",
        NUOC: "Tiền nước",
        QUANLY: "Phí quản lý",
        GUIXE: "Phí gửi xe",
        PHIKHAC: "Phí khác",
      };
      return services[code] || "Không xác định";
    },
    getStatusText(status) {
      const statuses = {
        "0": "Chưa thanh toán",
        "1": "Đã thanh toán",
        "2": "Đã quá hạn",
      };
      return statuses[status] || "Không xác định";
    },
  },
};
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