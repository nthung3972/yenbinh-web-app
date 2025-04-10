<template>
    <div class="container mt-5">
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
              Mã Căn Hộ: {{ invoice.apartment_number }}
            </span>
            <span class="badge bg-light text-primary">
              <Icon name="mdi:tag" size="16" class="me-1" />
              {{ getStatusText(invoice.status) }}
            </span>
          </div>
  
          <div class="card-body p-4">
            <!-- Thông tin hóa đơn -->
            <div class="row mb-4">
              <div class="col-md-6">
                <p class="mb-2">
                  <Icon name="mdi:calendar" size="18" class="me-2 text-muted" />
                  <strong>Ngày Phát Hành:</strong> {{ formatDate(invoice.invoice_date) }}
                </p>
              </div>
              <div class="col-md-6">
                <p class="mb-2">
                  <Icon name="mdi:calendar-check" size="18" class="me-2 text-muted" />
                  <strong>Hạn Thanh Toán:</strong> {{ formatDate(invoice.due_date) }}
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
                      <th>
                        <Icon name="mdi:file-document" size="16" class="me-2" />
                        Loại Phí
                      </th>
                      <th>
                        <Icon name="mdi:numeric" size="16" class="me-2" />
                        Số Lượng
                      </th>
                      <th>
                        <Icon name="mdi:currency-usd" size="16" class="me-2" />
                        Đơn Giá
                      </th>
                      <th>
                        <Icon name="mdi:cash-multiple" size="16" class="me-2" />
                        Thành Tiền
                      </th>
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
                  <Icon name="mdi:cash-register" size="20" class="me-2" />
                  Tổng Tiền: {{ formatVND(invoice.total_amount) }} VNĐ
                </h4>
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
import { computed } from 'vue'

const totalApartments = ref(0);
const totalResidents = ref(0);
const totalCollectionRate = ref(0);
const totalCollectionRateChange = ref(0);

// Nhận props từ component cha
const props = defineProps({
    data: {
        type: [Array, Object],
        default: () => []
    }
})



// Tạo computed property để xử lý dữ liệu Proxy
const processedData = computed(() => {
    if (Array.isArray(props.data)) {
        totalApartments.value = props.data.reduce((sum, building) => sum + building.apartments_count, 0);
        totalResidents.value = props.data.reduce((sum, building) => sum + building.residents_count, 0);
        
        totalCollectionRate.value = props.data.length > 0
            ? (props.data.reduce((sum, building) => sum + building.collectionRate, 0) / props.data.length).toFixed(2)
            : "0.00";
        totalCollectionRateChange.value = props.data.length > 0
            ? (props.data.reduce((sum, building) => sum + building.collectionRateChange, 0) / props.data.length).toFixed(2)
            : "0.00";
        return props.data
    }
    return []
})
</script>

<style>
.card {
    border-left: 5px solid #4cc9f0;
}

.pt-20 {
    padding-top: 20px;
}

.progress {
    margin: 5px 0 0 0;
}

.progress-bar {
    background-color: #4cc9f0;
}

.badge {
    background-color: #4cc9f0;
    border-radius: 20px;
    padding: 7px 10px 10px 10px;
}

.fw-bold {
    display: flex;
    align-items: center;
}

.fw-bold span {
    padding: 0 5px 0 0;
}

.icon-box {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    /* Bo góc */
}
</style>
