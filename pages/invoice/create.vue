<template>
  <div v-if="isLoading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Đang tải dữ liệu...</span>
    </div>
    <p class="text-muted mt-2">Đang tải dữ liệu...</p>
  </div>
  <div v-else class="container-fluid mt-3">
    <div class="card shadow-lg border-0 p-4" style="border-radius: 12px;">
      <div class="d-flex justify-content-between align-items-center border-bottom mb-4 pb-4">
        <h4 class="fw-bold text-primary">
          <Icon name="fa6-solid:file-invoice-dollar" size="24" class="me-2" />
          Tạo hóa đơn
        </h4>
        <button class="btn btn-outline-secondary" @click="goBack()">
          <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
          Quay lại
        </button>
      </div>
      <!-- Card chính -->
      <div class="card shadow-sm">
        <div class="card-body">
          <h4 class="d-flex fw-bold text-secondary justify-content-center align-items-center mt-3 mb-4">
            THÔNG TIN HÓA ĐƠN
          </h4>
          <!-- Form chọn căn hộ -->
          <h5 class="fw-bold text-primary mb-3">Thông tin căn hộ</h5>
          <div v-if="hasError" class="alert alert-danger text-center">{{ hasError }}</div>
          <div class="mb-4">
            <div class="row row-cols-1 row-cols-md-auto g-3 align-items-end">
              <div class="col-md-6">
                <label for="apartment" class="form-label fw-bold">Chọn căn hộ<span class="text-danger">*</span></label>
                <select id="apartment" v-model="selectedApartmentId" class="form-select"
                  :class="{ 'is-invalid': hasError }" @change="fetchApartmentFees">
                  <option value="" disabled>Chọn một căn hộ</option>
                  <option v-for="apartment in apartments" :key="apartment.apartment_id" :value="apartment.apartment_id">
                    {{ apartment.apartment_number }}
                  </option>
                </select>
              </div>

              <div class="col-md-3">
                <label class="form-label fw-medium">Ngày ban hành <span class="text-danger">*</span></label>
                <input v-model="invoice_date" type="date" class="form-control shadow-sm" @input="onChange()"
                  :class="{ 'is-invalid': errors?.invoice_date }" />
                <div v-if="errors?.invoice_date" class="invalid-feedback">{{ errors.invoice_date[0] }}</div>
              </div>

              <div class="col-md-3">
                <label class="form-label fw-medium">Hạn thanh toán <span class="text-danger">*</span></label>
                <input v-model="due_date" type="date" class="form-control shadow-sm" @input="onChange()"
                  :class="{ 'is-invalid': errors?.due_date }" />
                <div v-if="errors?.due_date" class="invalid-feedback">{{ errors.due_date[0] }}</div>
              </div>
            </div>
          </div>

          <!-- Phí cố định -->
          <div v-if="fees" class="mb-4">
            <h5 class="fw-bold text-primary mb-3">Phí cố định</h5>
            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th style="width: 30%;">Loại phí</th>
                  <th style="width: 20%;">Số tiền (VNĐ)</th>
                  <th style="width: 50%;">Mô tả</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(fee, index) in fees" :key="index">
                  <td>{{ fee.type }}</td>
                  <td>{{ formatCurrency(fee.amount) }}</td>
                  <td>{{ fee.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>

           <!-- Dư nợ tháng trước -->
          <div v-if="carryOverBalances" class="mb-4">
            <h5 class="fw-bold text-primary mb-3">Dư nợ</h5>
            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th style="width: 30%;">Tháng</th>
                  <th style="width: 20%;">Số tiền (VNĐ)</th>
                  <th style="width: 50%;">Mô tả</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(balance, index) in carryOverBalances" :key="index">
                  <td>{{ balance.month }}</td>
                  <td>{{ formatCurrency(balance.amount) }}</td>
                  <td>{{ balance.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Phí linh hoạt -->
          <div class="mb-4">
            <h5 class="fw-bold text-primary mb-3">Phí linh hoạt</h5>
            <div v-for="(fee, index) in flexibleFees" :key="index" class="row mb-2 align-items-end">
              <div class="col-md-2">
                <label :for="'fee-type-' + index" class="form-label">Loại phí<span class="text-danger">*</span></label>
                <select :id="'fee-type-' + index" v-model="fee.fee_type_id" class="form-select" @change="onChange()">
                  <option value="" disabled>Chọn loại phí</option>
                  <option v-for="feeType in flexibleFeeTypes" :key="feeType.fee_type_id" :value="feeType.fee_type_id">
                    {{ feeType.fee_name }}
                  </option>
                </select>
              </div>
              <div class="col-md-1">
                <label :for="'fee-quantity-' + index" class="form-label">Số lượng<span
                    class="text-danger">*</span></label>
                <input :id="'fee-quantity-' + index" v-model.number="fee.quantity" type="number" class="form-control"
                  min="0" @input="calculateAmount(index), onChange()" />
              </div>
              <div class="col-md-2">
                <label :for="'fee-price-' + index" class="form-label">Đơn giá (VNĐ)<span
                    class="text-danger">*</span></label>
                <input :id="'fee-price-' + index" v-model.number="fee.price" type="number" class="form-control" min="0"
                  @input="calculateAmount(index), onChange()" />
              </div>
              <div class="col-md-2">
                <label :for="'fee-amount-' + index" class="form-label">Số tiền (VNĐ)<span
                    class="text-danger">*</span></label>
                <input :id="'fee-amount-' + index" :value="formatAmount(fee.amount)" type="number" class="form-control"
                  readonly />
              </div>
              <div class="col-md-4">
                <label :for="'fee-description-' + index" class="form-label">Mô tả<span
                    class="text-danger">*</span></label>
                <input :id="'fee-description-' + index" v-model="fee.description" type="text" class="form-control"
                  @input="onChange()" />
              </div>
              <div class="col-md-1">
                <button class="btn btn-outline-danger w-100" @click="removeFlexibleFee(index)">
                  <Icon name="ep:remove-filled" size="20" class="me-2" />Xóa
                </button>
              </div>
            </div>
            <button class="btn btn-outline-success" @click="addFlexibleFee">
              <Icon name="gridicons:add" size="20" class="me-2" />Thêm phí linh hoạt
            </button>
          </div>

          <!-- Tóm tắt hóa đơn -->
          <div v-if="fees" class="mb-4">
            <h5 class="fw-bold text-success mb-3">
              <Icon name="fluent:feed-32-filled" size="24" class="me-2" />CHI TIẾT HÓA ĐƠN
            </h5>
            <div class="alert alert-info">
              <p class="mb-1">
                <strong>Tổng phí cố định:</strong> {{ formatCurrency(totalFixedFees) }}
              </p>
              <p class="mb-1">
                <strong>Tổng dư nợ:</strong> {{ formatCurrency(totalCarryOverBalance) }}
              </p>
              <p class="mb-1">
                <strong>Tổng phí linh hoạt:</strong> {{ formatCurrency(totalFlexibleFees) }}
              </p>
              <p class="mb-0 fw-bold">
                <strong>Tổng cộng: </strong> {{ formatCurrency(totalFees) }}
              </p>
            </div>
          </div>

          <!-- Nút tạo hóa đơn -->
          <div class="text-end">
            <button style="margin-right: 5px;" class="btn btn-secondary" @click="reset()">
              <Icon name="bx:reset" size="20" class="me-2" />Làm mới
            </button>
            <button class="btn btn-primary" :disabled="!canCreateInvoice" @click="createInvoice">
              <Icon name="lsicon:submit-filled" size="20" class="me-2" />Tạo hóa đơn
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal xác nhận chuyển hướng -->
  <ConfirmNavigationModal v-model="showConfirmModal" @confirm="confirmNavigation" @cancel="cancelNavigation" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useDashboardStore } from '@/stores/dashboard'
import { useApartmentStore } from '@/stores/apartment'
import { useInvoiceStore } from '@/stores/invoice'
import { useFeeStore } from '@/stores/fee'
import { useRouter } from 'vue-router'
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'

definePageMeta({
  middleware: "auth",
  layout: "dashboard"
})

// State
const apartments = ref([])
const selectedApartmentId = ref('')
const fees = ref(null)
const carryOverBalances = ref([])
const flexibleFees = ref([])
const flexibleFeeTypes = ref([])
const dashboardStore = useDashboardStore()
const apartmentStore = useApartmentStore()
const invoiceStore = useInvoiceStore()
const feeStore = useFeeStore()
const invoice_date = ref(null)
const due_date = ref(null)
const router = useRouter()
const building_id = dashboardStore.getSelectedBuildingId;
const toast = useToast()
const errors = ref({})
const isLoading = computed(() => invoiceStore.isLoading);
const hasError = computed(() => invoiceStore.hasError);

const goBack = () => {
  router.back()
}

const {
  hasUnsavedChanges,
  showConfirmModal,
  setupRouteGuard,
  setEditing,
  confirmNavigation,
  cancelNavigation,
  navigateSafely
} = useUnsavedChangesGuard()

const onChange = () => {
  setEditing(true)
}

const reset = () => {
  selectedApartmentId.value = ''
  fees.value = null
  flexibleFees.value = []
  totalFees.value = 0
  invoice_date.value = null
  due_date.value = null
  setEditing(false)
}

// Tính toán phí
const totalFixedFees = computed(() => {
  if (!fees.value || !Array.isArray(fees.value)) return 0
  return fees.value.reduce((sum, fee) => {
    return sum + parseFloat(fee.amount || 0)
  }, 0)
})

const totalCarryOverBalance = computed(() => {
  if (!carryOverBalances.value || !Array.isArray(carryOverBalances.value)) return 0
  return carryOverBalances.value.reduce((sum, balance) => {
    return sum + parseFloat(balance.amount || 0)
  }, 0)
})

const formatAmount = (value) => {
  if (typeof value !== 'number') return value;
  return value.toLocaleString('vi-VN');
}

const totalFlexibleFees = computed(() => {
  return flexibleFees.value.reduce((sum, fee) => sum + Number(fee.amount || 0), 0)
})

const totalFees = computed(() => {
  return Math.round(totalFixedFees.value) + Math.round(totalFlexibleFees.value) + Math.round(totalCarryOverBalance.value)
})

const canCreateInvoice = computed(() => {
  return (
    selectedApartmentId.value &&
    flexibleFees.value.every(
      (fee) => fee.fee_type_id && fee.amount > 0 && fee.description
    )
  )
})

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

// Tính amount tự động
const calculateAmount = (index) => {
  const fee = flexibleFees.value[index]
  fee.amount = (fee.quantity || 0) * (fee.price || 0)
}

// Lấy danh sách căn hộ
const fetchApartments = async () => {
  try {
    const data = await apartmentStore.getCodeApartments(building_id)
    apartments.value = data
  } catch (error) {
    toast.error('Lỗi khi lấy danh sách căn hộ')
  }
}

// Lấy phí cố định
const fetchApartmentFees = async () => {
  if (!selectedApartmentId.value) return
  try {
    const data = await invoiceStore.getApartmentFees(selectedApartmentId.value)
    console.log('Fetched fees:', data)
    fees.value = data.fixed_fees || []
    carryOverBalances.value = data.carry_over_balances || []

  } catch (error) {
    toast.error('Lỗi khi lấy phí cố định')
    fees.value = null
  }
}

// Lấy danh sách loại phí linh hoạt
const fetchFlexibleFeeTypes = async () => {
  try {
    const data = await feeStore.getFlexibleFee()
    flexibleFeeTypes.value = data
  } catch (error) {
    toast.error('Lỗi khi lấy loại phí linh hoạt')
  }
}

// Thêm phí linh hoạt
const addFlexibleFee = () => {
  flexibleFees.value.push({
    fee_type_id: '',
    amount: 0,
    description: '',
  })
}

// Xóa phí linh hoạt
const removeFlexibleFee = (index) => {
  flexibleFees.value.splice(index, 1)
}

const getFixedFees = () => {
  return (fees.value || []).map(fee => {
    let fee_type_id = null

    if (fee.type === 'Phí quản lý vận hành') {
      fee_type_id = 1
    } else if (fee.type === 'Phí gửi xe') {
      fee_type_id = 2
    }
    else if (fee.type === 'Thù lao ban quản trị') {
      fee_type_id = 6
    }
    else if (fee.type.includes('Nợ tháng') || fee.type.includes('Dư tháng')) {
      fee_type_id = 8
    }

    return {
      fee_type_id,
      amount: Number(fee.amount),
      description: fee.description,
    }
  })
}

// Tạo hóa đơn
const createInvoice = async () => {
  errors.value = {}
  try {
    const allFees = [
      // Phí cố định
      ...getFixedFees(),
      // Phí linh hoạt
      ...flexibleFees.value.map(fee => ({
        fee_type_id: fee.fee_type_id,
        quantity: fee.quantity,
        price: fee.price,
        amount: fee.amount,
        description: fee.description,
      })),
    ]

    const monllyAmount = allFees.reduce((sum, fee) => {
      return sum + (fee.amount || 0)
    }, 0)

    const data = {
      apartment_id: selectedApartmentId.value,
      building_id: building_id,
      monthly_amount: monllyAmount,
      total_amount: totalFees.value,
      invoice_date: invoice_date.value,
      due_date: due_date.value,
      fees: allFees,
    }

    console.log('Creating invoice with data:', data)

    await invoiceStore.createInvoice(data)
    toast.success('Tạo hóa đơn thành công')
    reset()
  } catch (error) {
    errors.value = error.errors
    toast.error('Lỗi khi tạo hóa đơn')
  }
}

// Khởi tạo
onMounted(() => {
  fetchApartments()
  fetchFlexibleFeeTypes()
  setupRouteGuard()
})
</script>

<style scoped>
.form-label {
  font-size: 0.95rem;
  color: #495057;
}

.form-control,
.form-select {
  border-radius: 8px;
  padding: 0.5rem 1rem;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  font-size: 0.85rem;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.table td {
  vertical-align: middle;
}

.btn {
  border-radius: 8px;
  padding: 0.3rem 1rem;
  transition: all 0.2s ease;
}

.btn:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.total-section {
  font-size: 1.1rem;
  color: #212529;
}
</style>
