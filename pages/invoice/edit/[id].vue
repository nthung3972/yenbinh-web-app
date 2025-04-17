<template>
  <div class="container mt-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold text-primary">
          <Icon name="mdi:receipt-text" size="24" class="me-2" />
          Sửa hóa đơn
        </h3>
        <button class="btn btn-outline-secondary" @click="goBack()">
          <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
          Quay lại
        </button>
      </div>

    <!-- Card chính -->
    <div v-if="invoice" class="card shadow-sm">
      <div class="card-body">
        <!-- Thông tin hóa đơn -->
        <div class="mb-4">
          <div class="row row-cols-1 row-cols-md-auto g-3 align-items-end">
            <div class="col-md-3">
              <label for="apartment" class="form-label fw-bold">Căn hộ</label>
              <input :value="invoice.apartment_number" class="form-control" readonly />
            </div>
            <div class="col-md-3">
              <label class="form-label fw-medium">Ngày ban hành<span class="text-danger">*</span></label>
              <input v-model="invoice_date" type="date" class="form-control shadow-sm" @input="onChange()"
                :class="{ 'is-invalid': errors?.invoice_date }" />
            </div>
            <div class="col-md-3">
              <label class="form-label fw-medium">Hạn thanh toán<span class="text-danger">*</span></label>
              <input v-model="due_date" type="date" class="form-control shadow-sm" @input="onChange()"
                :class="{ 'is-invalid': errors?.due_date }" />
            </div>

            <div class="col-md-3">
              <label class="form-label fw-semibold">Trạng thái</label>
              <select v-model="status" class="form-select" @change="onChange()">
                <option :value="0">Chưa thanh toán</option>
                <option :value="1">Đã thanh toán</option>
              </select>
            </div>

          </div>
        </div>

        <!-- Phí cố định -->
        <div v-if="fees" class="mb-4">
          <h5 class="fw-bold mb-3">Phí cố định</h5>
          <table class="table table-bordered">
            <thead class="table-light">
              <tr>
                <th>Loại phí</th>
                <th>Số tiền (VNĐ)</th>
                <th>Mô tả</th>
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

        <!-- Phí linh hoạt -->
        <div class="mb-4">
          <h5 class="fw-bold mb-3">Phí linh hoạt</h5>
          <div v-for="(fee, index) in flexibleFees" :key="index" class="row mb-2 align-items-end">
            <div class="col-md-2">
              <label :for="'fee-type-' + index" class="form-label">Loại phí</label>
              <select :id="'fee-type-' + index" v-model="fee.fee_type_id" class="form-select" @change="onChange()">
                <option value="" disabled>Chọn loại phí</option>
                <option v-for="feeType in flexibleFeeTypes" :key="feeType.fee_type_id" :value="feeType.fee_type_id">
                  {{ feeType.fee_name }}
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <label :for="'fee-quantity-' + index" class="form-label">Số lượng</label>
              <input :id="'fee-quantity-' + index" v-model.number="fee.quantity" type="number" class="form-control"
                min="0" @input="calculateAmount(index)" />
            </div>
            <div class="col-md-2">
              <label :for="'fee-price-' + index" class="form-label">Đơn giá (VNĐ)</label>
              <input :id="'fee-price-' + index" v-model.number="fee.price" type="number" class="form-control" min="0"
                @input="calculateAmount(index)" />
            </div>
            <div class="col-md-2">
              <label :for="'fee-amount-' + index" class="form-label">Số tiền (VNĐ)</label>
              <input :id="'fee-amount-' + index" :value="fee.amount" type="number" class="form-control" readonly />
            </div>
            <div class="col-md-2">
              <label :for="'fee-description-' + index" class="form-label">Mô tả</label>
              <input :id="'fee-description-' + index" v-model="fee.description" type="text" class="form-control" @input="onChange()" />
            </div>
            <div class="col-md-2">
              <button class="btn btn-outline-danger w-100" @click="removeFlexibleFee(index)">
                <Icon name="ep:remove-filled" size="20" class="me-2" />Xóa
              </button>
            </div>
          </div>
          <button class="btn btn-outline-success mt-2" @click="addFlexibleFee">
            <Icon name="gridicons:add" size="20" class="me-2" />Thêm phí linh hoạt
          </button>
        </div>

        <!-- Tóm tắt hóa đơn -->
        <div v-if="fees" class="mb-4">
          <h5 class="fw-bold mb-3">Tóm tắt hóa đơn</h5>
          <div class="alert alert-info">
            <p class="mb-1">
              <strong>Tổng phí cố định:</strong> {{ formatCurrency(totalFixedFees) }}
            </p>
            <p class="mb-1">
              <strong>Tổng phí linh hoạt:</strong> {{ formatCurrency(totalFlexibleFees) }}
            </p>
            <p class="mb-0 fw-bold">
              <strong>Tổng cộng:</strong> {{ formatCurrency(totalFees) }}
            </p>
          </div>
        </div>

        <!-- Nút lưu thay đổi -->
        <div class="text-end">
          <button class="btn btn-primary" :disabled="!canSaveInvoice" @click="updateInvoice">
            <Icon name="lsicon:submit-filled" size="20" class="me-2" />Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-warning">
      Hóa đơn không tồn tại hoặc đang tải...
    </div>
  </div>

   <!-- Modal xác nhận chuyển hướng -->
   <ConfirmNavigationModal
      v-model="showConfirmModal"
      @confirm="confirmNavigation"
      @cancel="cancelNavigation"
    />
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useInvoiceStore } from '@/stores/invoice'
import { useFeeStore } from '@/stores/fee'
import { useRouter, useRoute } from 'vue-router'
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

// State
const route = useRoute()
const router = useRouter()
const invoice = ref(null)
const selectedApartmentId = ref('')
const fees = ref(null)
const flexibleFees = ref([])
const flexibleFeeTypes = ref([])
const invoiceStore = useInvoiceStore()
const feeStore = useFeeStore()
const invoice_date = ref(null)
const due_date = ref(null)
const status = ref(null)
const errors = ref({})
const toast = useToast()

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

// Tính toán phí
const totalFixedFees = computed(() => {
  if (!fees.value || !Array.isArray(fees.value)) return 0
  return fees.value.reduce((sum, fee) => {
    return sum + Number(fee.amount || 0)
  }, 0)
})

const totalFlexibleFees = computed(() => {
  return flexibleFees.value.reduce((sum, fee) => sum + (fee.amount || 0), 0)
})

const totalFees = computed(() => {
  return totalFixedFees.value + totalFlexibleFees.value
})

const canSaveInvoice = computed(() => {
  return (
    selectedApartmentId.value &&
    invoice_date.value &&
    due_date.value &&
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

// Lấy phí cố định và thông tin hóa đơn
const fetchInvoiceData = async () => {
  try {
    const data = await invoiceStore.fetchInvoice(route.params.id)
    invoice.value = data
    selectedApartmentId.value = data.apartment_id
    invoice_date.value = data.invoice_date
    due_date.value = data.due_date
    status.value = data.status
    // Lấy phí cố định từ invoice_details
    fees.value = data.invoice_details
      .filter(detail => detail.fee_types.is_fixed === 1)
      .map(detail => ({
        type: detail.fee_name,
        amount: detail.amount,
        description: detail.description
      }))
    // Lấy phí linh hoạt
    flexibleFees.value = data.invoice_details
      .filter(detail => detail.fee_types.is_fixed === 0)
      .map(detail => ({
        fee_type_id: detail.fee_type_id,
        quantity: detail.quantity || 0,
        price: detail.price || 0,
        amount: detail.amount,
        description: detail.description
      }))
  } catch (error) {
    toast.error('Lỗi khi lấy thông tin hóa đơn')
    invoice.value = null
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
    quantity: 0,
    price: 0,
    amount: 0,
    description: ''
  })
}

// Xóa phí linh hoạt
const removeFlexibleFee = (index) => {
  flexibleFees.value.splice(index, 1)
}

// Chuẩn bị phí cố định
const getFixedFees = () => {
  return (fees.value || []).map(fee => {
    let fee_type_id = null
    if (fee.type === 'Phí quản lý vận hành') {
      fee_type_id = 1
    } else if (fee.type === 'Phí gửi xe') {
      fee_type_id = 2
    }
    return {
      fee_type_id,
      amount: fee.amount,
      description: fee.description
    }
  })
}

// Cập nhật hóa đơn
const updateInvoice = async () => {
  try {
    const allFees = [
      ...getFixedFees(),
      ...flexibleFees.value.map(fee => ({
        fee_type_id: fee.fee_type_id,
        quantity: fee.quantity,
        price: fee.price,
        amount: fee.amount,
        description: fee.description
      }))
    ]

    const data = {
      invoice_id: route.params.id,
      total_amount: totalFees.value,
      invoice_date: invoice_date.value,
      due_date: due_date.value,
      status: status.value,
      fees: allFees
    }

    await invoiceStore.updateInvoice(route.params.id, data)
    setEditing(false)
    toast.success('Cập nhật hóa đơn thành công')
    router.push('/invoice')
  } catch (error) {
    toast.error('Lỗi khi cập nhật hóa đơn')
  }
}

// Khởi tạo
onMounted(() => {
  fetchFlexibleFeeTypes()
  fetchInvoiceData()
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
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
}

.btn:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.alert-info {
  background-color: #e7f1ff;
  border-color: #d3e2ff;
}
</style>