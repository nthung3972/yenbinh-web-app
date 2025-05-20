<template>
  <div class="container-fluid mt-2">
    <div class="row mb-4">
      <div class="col-12">
        <h3 class="text-center fw-bold text-primary mb-4">
          <Icon name="material-symbols:overview" size="28" class="me-2" />Thống Kê Tài Chính
        </h3>

        <!-- Bộ lọc -->
        <div class="card shadow-sm mb-2">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-3" v-if="buildings.length > 1">
                <label for="building_id" class="form-label fw-bold">Tòa nhà</label>
                <select v-model="filters.building_id" @change="onFilter" class="form-select">
                  <option value="" selected>Chọn tòa nhà</option>
                  <option v-for="building in buildings" :key="building.building_id" :value="building.building_id">
                    {{ building.name }}
                  </option>
                </select>
              </div>

              <!-- Lọc kiểu thời gian -->
              <div class="col-md-3">
                <label for="period_type" class="form-label fw-bold">Kiểu thời gian</label>
                <select id="period_type" v-model="filters.period_type" class="form-select"
                  @change="filters.period_value = ''">
                  <option value="">Tất cả</option>
                  <option value="month">Tháng</option>
                  <option value="quarter">Quý</option>
                  <option value="year">Năm</option>
                </select>
              </div>

              <!-- Lọc giá trị thời gian -->
              <div class="col-md-3">
                <label for="period_value" class="form-label fw-bold">Thời gian</label>
                <select id="period_value" v-model="filters.period_value" class="form-select" @change="onFilter">
                  <option value="">Tất cả</option>
                  <option v-for="option in periodOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <!-- Lọc trạng thái -->
              <div class="col-md-3">
                <label for="status" class="form-label fw-bold">Trạng thái</label>
                <select id="status" v-model="filters.status" class="form-select" @change="onFilter">
                  <option value="">Tất cả</option>
                  <option :value="0">Chưa thanh toán</option>
                  <option :value="1">Đã thanh toán</option>
                  <option :value="2">Đã quá hạn</option>
                  <option :value="3">Thanh toán một phần</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center">
      <div class="spinner-border spinner-border-sm me-2" role="status">
        <span class="visually-hidden">Đang tải dữ liệu...</span>
      </div>
      <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="hasError">{{ hasError }}</div>

    <div v-else>
      <!-- Thống kê tổng quan -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <div class="card shadow-sm h-100 border-0">
            <div class="card-body d-flex flex-column">
              <div class="d-flex align-items-center mb-3">
                <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <i class="bi bi-cash-stack fs-4 text-primary"></i>
                </div>
                <div>
                  <h6 class="mb-0 text-muted">Tổng hóa đơn</h6>
                  <h3 class="mb-0 fw-bold">{{ formatCurrency(totalIssuedAmount) }}</h3>
                </div>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-primary" role="progressbar" :style="`width: 100%`"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <div class="card shadow-sm h-100 border-0">
            <div class="card-body d-flex flex-column">
              <div class="d-flex align-items-center mb-3">
                <div class="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                  <i class="bi bi-check-circle fs-4 text-success"></i>
                </div>
                <div>
                  <h6 class="mb-0 text-muted">Đã thanh toán</h6>
                  <h3 class="mb-0 fw-bold">{{ formatCurrency(totalPaidAmount) }}</h3>
                </div>
              </div>
              <div class="progress" style="height: 5px;">
                <div class="progress-bar bg-success" role="progressbar"
                  :style="`width: ${(totalPaidAmount / totalIssuedAmount) * 100}%`"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <div class="card shadow-sm h-100 border-0">
            <div class="card-body d-flex flex-column">
              <div class="d-flex align-items-center mb-3">
                <div class="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                  <i class="bi bi-clock-history fs-4 text-warning"></i>
                </div>
                <div>
                  <h6 class="mb-0 text-muted">Còn nợ</h6>
                  <h3 class="mb-0 fw-bold">{{ formatCurrency(totalDebt) }}</h3>
                </div>
              </div>
              <div class="progress" style="height: 5px;">
                <div class="progress-bar bg-warning" role="progressbar"
                  :style="`width: ${(totalDebt / totalIssuedAmount) * 100}%`"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <div class="card shadow-sm h-100 border-0">
            <div class="card-body d-flex flex-column">
              <div class="d-flex align-items-center mb-3">
                <div class="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                  <i class="bi bi-exclamation-triangle fs-4 text-danger"></i>
                </div>
                <div>
                  <h6 class="mb-0 text-muted">Nợ quá hạn</h6>
                  <h3 class="mb-0 fw-bold">{{ formatCurrency(overdueDebt) }}</h3>
                </div>
              </div>
              <div class="progress" style="height: 5px;">
                <div class="progress-bar bg-danger" role="progressbar"
                  :style="`width: ${(overdueDebt / totalIssuedAmount) * 100}%`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Biểu đồ và Bảng dữ liệu -->
      <div class="row mb-4">
        <div class="col-lg-7 mb-4 mb-lg-0">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-white border-0">
              <h5 class="mb-0">Thống kê hóa đơn</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-4">
                  <div class="border rounded p-3 h-100">
                    <h6 class="mb-3">Tỷ lệ thanh toán</h6>
                    <canvas id="paymentRatioChart" height="100"></canvas>
                  </div>
                </div>
                <div class="col-md-6 mb-4">
                  <div class="border rounded p-3 h-100">
                    <h6 class="mb-3">Thống kê hóa đơn</h6>
                    <canvas id="invoiceStatusChart" height="100"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-white d-flex align-items-center border-0 me-2">
              <h5 class="mb-0">Hóa đơn chưa thanh toán </h5> 
            </div>
            <div class="card-body p-0">
              <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                <table class="table table-hover">
                  <thead class="table-primary sticky-top">
                    <tr>
                      <th style="width: 10%;">#</th>
                      <th style="width: 25%;">Căn hộ</th>
                      <th style="width: 20%;">Số tiền nợ</th>
                      <th style="width: 20%;">Hạn thanh toán</th>
                      <th style="width: 25%;">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(invoice, index) in unpaidInvoices" :key="invoice.invoice_id">
                      <td>{{ index + 1}}</td>
                      <td>{{ invoice.apartment_number }}</td>
                      <td>{{ formatCurrency(invoice.remaining_balance) }}</td>
                      <td>{{ formatDate(invoice.due_date) }}</td>
                      <td>
                        <span class="badge" :class="getStatusBadgeClass(invoice.status)">
                          {{ getStatusText(invoice.status) }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="unpaidInvoices?.length === 0">
                      <td colspan="5" class="text-center py-3">Không có hóa đơn chưa thanh toán</td>
                    </tr>
                  </tbody>
                </table>
                <Pagination :pagination="debtStore.pagination" @page-change="handlePageChange" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chi tiết phí -->
      <div class="row mb-4">
        <div class="col-lg-6 mb-4 mb-lg-0">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-white border-0">
              <h5 class="mb-0">Thống kê loại phí (Cố định)</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-12">
                  <div class="border rounded p-3">
                    <h6 class="mb-3">Phân tích chi phí theo loại</h6>
                    <canvas id="feeDistributionChart" height="200"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6">
          <div class="card shadow-sm">
            <div class="card-header bg-white border-0">
              <h5 class="mb-0">Chi tiết các loại phí</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered align-middle w-100">
                  <thead class="table-primary">
                    <tr>
                      <th style="width: 25%;">Loại phí</th>
                      <th style="width: 60%;">Mô tả</th>
                      <th style="width: 15%;" class="text-end">Số tiền (VNĐ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(fee, index) in totalFees" :key="index">
                      <!-- Dòng tổng phí từng loại -->
                      <tr class="table-info fw-semibold">
                        <td>{{ fee.type }}</td>
                        <td>{{ fee.description }}</td>
                        <td class="text-end">{{ formatCurrency(fee.amount) }}</td>
                      </tr>
                      <!-- Dòng chi tiết -->
                      <tr v-if="fee.details && fee.details.length" v-for="(detail, idx) in fee.details"
                        :key="`${index}-${idx}`">
                        <td class="ps-4"> {{ detail.type }}</td>
                        <td>{{ detail.description }}</td>
                        <td class="text-end">{{ formatCurrency(detail.amount) }}</td>
                      </tr>
                    </template>
                  </tbody>
                  <tfoot class="table-success fw-semibold">
                    <tr>
                      <td style="width: 25%;">Tổng cộng: </td>
                      <td style="min-width: 60%;"></td>
                      <td style="width: 15%;" class="text-end">{{ formatCurrency(totalFeesAmount) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useDebtStore } from '@/stores/debt'
import Pagination from '@/components/pagination/Pagination.vue'

definePageMeta({
  middleware: "auth",
  layout: "dashboard"
})

Chart.register(...registerables);

const {
  buildings,
} = useInitialData();

const filters = ref({
  page: 1,
  per_page: 10,
  building_id: '',
  period_type: '',
  period_value: '',
  status: ''
})

const debtStore = useDebtStore()
const isLoading = computed(() => debtStore.isLoading);
const hasError = computed(() => debtStore.hasError);

const onFilter = () => {
  filters.value.page = 1
  loadDebts()
}

const handlePageChange = (page) => {
  filters.value.page = page
  loadDebts()
};

// Tùy chọn thời gian
const periodOptions = computed(() => {
  const type = filters.value.period_type;
  if (type === 'month') {
    return debtStore.periods.months || [];
  } else if (type === 'quarter') {
    return debtStore.periods.quarters || [];
  } else if (type === 'year') {
    return debtStore.periods.years || [];
  }
  return [];
});

// Load dữ liệu
const loadDebts = async () => {
  const params = { ...filters.value };
  await debtStore.fetchDebts(
    params.page,
    params.per_page,
    params.building_id,
    params.period_type,
    params.period_value,
    params.status
  );
  renderCharts();
};

// Computed properties
const totalIssuedAmount = computed(() => parseFloat(debtStore.debts.total_issued_amount));
const totalPaidAmount = computed(() => parseFloat(debtStore.debts.total_paid_amount));
const totalDebt = computed(() => debtStore.debts.total_debt);
const overdueDebt = computed(() => debtStore.debts.overdue_debt);
const totalFees = computed(() => debtStore.debts.total_fees);
const totalFeesAmount = computed(() => {
  return totalFees?.value.reduce((sum, fee) => sum + fee.amount, 0);
});

const unpaidInvoices = computed(() => {
  return debtStore.debts.invoices?.filter(invoice => parseFloat(invoice.remaining_balance) > 0);
});

// Hàm chức năng
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN').format(date);
};

const getStatusText = (status) => {
  const statusMap = {
    0: 'Chưa thanh toán',
    1: 'Đã thanh toán',
    2: 'Đã quá hạn',
    3: 'Thanh toán một phần'
  };
  return statusMap[status] || 'Không xác định';
};

const getStatusBadgeClass = (status) => {
  const classMap = {
    0: 'bg-warning',
    1: 'bg-primary',
    2: 'bg-danger',
    3: 'bg-info'
  };
  return classMap[status] || 'bg-secondary';
};

let paymentRatioChart = null;
let invoiceStatusChart = null;
let feeDistributionChart = null;

// Biểu đồ
const renderCharts = () => {
  // 1. Biểu đồ tỷ lệ thanh toán
  const paymentRatioCtx = document.getElementById('paymentRatioChart');
  if (paymentRatioCtx) {
    if (paymentRatioChart) paymentRatioChart.destroy(); // Hủy biểu đồ cũ

    paymentRatioChart = new Chart(paymentRatioCtx, {
      type: 'doughnut',
      data: {
        labels: ['Đã thanh toán', 'Còn nợ'],
        datasets: [{
          data: [totalPaidAmount.value, totalDebt.value],
          backgroundColor: ['#28a745', '#ffc107'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  // 2. Biểu đồ trạng thái hóa đơn
  const invoiceStatusCtx = document.getElementById('invoiceStatusChart');
  if (invoiceStatusCtx) {
    if (invoiceStatusChart) invoiceStatusChart.destroy(); // Hủy biểu đồ cũ

    const statusCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
    debtStore.debts.invoices.forEach(invoice => {
      statusCounts[invoice.status] = (statusCounts[invoice.status] || 0) + 1;
    });

    invoiceStatusChart = new Chart(invoiceStatusCtx, {
      type: 'pie',
      data: {
        labels: ['Chưa thanh toán', 'Đã thanh toán', 'Đã quá hạn', 'Thanh toán một phần'],
        datasets: [{
          data: [statusCounts[0], statusCounts[1], statusCounts[2], statusCounts[3]],
          backgroundColor: ['#ffc107', '#28a745', 'red', '#17a2b8'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  // 3. Biểu đồ phân bổ chi phí
  const feeDistributionCtx = document.getElementById('feeDistributionChart');
  if (feeDistributionCtx) {
    if (feeDistributionChart) feeDistributionChart.destroy(); // Hủy biểu đồ cũ

    const feeLabels = totalFees.value.map(fee => fee.type);
    const feeAmounts = totalFees.value.map(fee => fee.amount);

    feeDistributionChart = new Chart(feeDistributionCtx, {
      type: 'bar',
      data: {
        labels: feeLabels,
        datasets: [{
          label: 'Số tiền (VNĐ)',
          data: feeAmounts,
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => value.toLocaleString('vi-VN') + ' đ'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: context =>
                context.dataset.label + ': ' + context.raw.toLocaleString('vi-VN') + ' đ'
            }
          }
        }
      }
    });
  }
};

onMounted(async () => {
  await debtStore.fetchPeriods()
  await loadDebts()
  await renderCharts()
});
</script>

<style>
table {
  table-layout: fixed;
  width: 100%;
}

table th,
table td {
  word-wrap: break-word;
}
</style>