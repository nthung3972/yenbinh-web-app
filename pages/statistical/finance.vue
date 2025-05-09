<template>
  <div class="container">
    <!-- Tiêu đề -->
    <h4 class="mb-4 text-center text-primary">
      <Icon name="material-symbols:overview" size="22" />
      Thống kê tài chính
    </h4>

    <!-- Bộ lọc -->
    <div class="mb-4">
      <div class="row g-3">
        <!-- Lọc tòa nhà -->
        <div class="col-md-3">
          <label for="building_id" class="form-label">Tòa nhà</label>
          <select v-model="filters.building_id" @change="onFilter" class="form-select">
            <option value="" selected>Chọn tòa nhà</option>
            <option v-for="building in dashboardStore.getData" :key="building.building_id"
              :value="building.building_id">
              {{ building.name }}
            </option>
          </select>
        </div>
        <!-- Lọc kiểu thời gian -->
        <div class="col-md-3">
          <label for="period_type" class="form-label">Kiểu thời gian</label>
          <select id="period_type" v-model="filters.period_type" class="form-select" @change="filters.period_value = ''">
            <option value="">Tất cả</option>
            <option value="month">Tháng</option>
            <option value="quarter">Quý</option>
            <option value="year">Năm</option>
          </select>
        </div>
        <!-- Lọc giá trị thời gian -->
        <div class="col-md-3">
          <label for="period_value" class="form-label">Thời gian</label>
          <select id="period_value" v-model="filters.period_value" class="form-select"@change="onFilter">
            <option value="">Tất cả</option>
            <option v-for="option in periodOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <!-- Lọc trạng thái -->
        <div class="col-md-3">
          <label for="status" class="form-label">Trạng thái</label>
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

    <!-- Loading -->
    <div v-if="debtStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-if="debtStore.error" class="alert alert-danger" role="alert">
      {{ debtStore.error }}
    </div>

    <!-- Tổng quan công nợ -->
    <div v-if="!debtStore.loading && !debtStore.error" class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Tổng giá trị phát hành</h5>
            <p class="card-text fs-4">{{ formatCurrency(debtStore.debts?.total_issued_amount) }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Tổng giá trị đã thu</h5>
            <p class="card-text fs-4">{{ formatCurrency(debtStore.debts?.total_paid_amount) }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Tổng công nợ</h5>
            <p class="card-text fs-4">{{ formatCurrency(debtStore.debts?.total_debt) }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Công nợ quá hạn</h5>
            <p class="card-text fs-4">{{ formatCurrency(debtStore.debts?.overdue_debt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bảng chi tiết công nợ -->
    <div v-if="!debtStore.loading && !debtStore.error" class="card">
      <div class="card-body">
        <h5 class="card-title">Chi tiết công nợ</h5>
        <table class="table table-striped">
          <thead>
            <tr>
              <th style="width: 5%;">#</th>
              <th>Tòa nhà</th>
              <th>Căn hộ</th>
              <th>Tổng công nợ</th>
              <th>Công nợ quá hạn</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(debt, index) in debtStore.debts.invoices" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ debt.building_name }}</td>
              <td> {{ debt.apartment_number }}</td>
              <td>{{ formatCurrency(debt.remaining_balance) }}</td>
              <td>{{ formatCurrency(debt.is_overdue ? debt.remaining_balance : 0) }}</td>
              <td>
                {{ translateStatus(debt.status) }}
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination :pagination="debtStore.pagination" @page-change="handlePageChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useDebtStore } from '@/stores/debt'
import { useDashboardStore } from '@/stores/dashboard'
import Pagination from '@/components/pagination/Pagination.vue'

definePageMeta({
  middleware: "auth",
  layout: "dashboard"
})

const debtStore = useDebtStore()
const dashboardStore = useDashboardStore()

// Bộ lọc
const filters = ref({
    page: 1,
    per_page: 10,
    building_id: '',
    period_type: '',
    period_value: '',
    status: ''
})

// Load dữ liệu
const loadDebts = async () => {
  const params = { ...filters.value };
  console.log(params)
  await debtStore.fetchDebts(
    params.page,
    params.per_page,
    params.building_id,
    params.period_type,
    params.period_value,
    params.status
  );
};

const onFilter = () => {
    filters.value.page = 1
    loadDebts()
}

const handlePageChange = (page) => {
    filters.value.page = page
    loadDebts();
};

// const fetchDebtHistory = async () => {
//   const params = { ...filters.value };
//   await debtStore.fetchDebtHistory(
//     params.period_type,
//     params.period_value,
//     params.status
//   );
// }

// Format tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Dịch trạng thái
const translateStatus = (status) => {
  const statusMap = {
    0: 'Chưa thanh toán',
    1: 'Đã thanh toán',
    3: 'Thanh toán một phần',
    2: 'Đã quá hạn'
  };
  return statusMap[status] || status;
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

onMounted(async () => {
  await debtStore.fetchPeriods()
  // await fetchDebtHistory();
  await loadDebts()
});
</script>

<style scoped>
.card {
  transition: all 0.3s;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>