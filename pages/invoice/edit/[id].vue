<template>
  <div v-if="isLoading" class="text-center">
    <div class="spinner-border spinner-border-sm me-2" role="status">
      <span class="visually-hidden">Đang tải dữ liệu...</span>
    </div>
    <p>Đang tải dữ liệu...</p>
  </div>
  <div v-else>
    <div class="invoice-container container mt-4">
      <h4>Chỉnh sửa hóa đơn</h4>
      <div class="card p-4 shadow-sm">
        <form @submit.prevent="updateInvoice">
          <div class="form-group">
            <label>Mã Căn Hộ</label>
            <input v-model="invoiceForm.apartment_number" type="text" class="form-control" disabled>
            <small v-if="errors['apartment_number']" class="text-danger">
              {{ errors['apartment_number'] }}
            </small>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <div class="form-group">
                <label>Ngày Phát hành</label>
                <input v-model="invoiceForm.invoice_date" type="date" class="form-control">
                <small v-if="errors['invoice_date']" class="text-danger">
                  {{ errors['invoice_date'] }}
                </small>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="form-group">
                <label>Hạn thanh toán</label>
                <input v-model="invoiceForm.due_date" type="date" class="form-control">
                <small v-if="errors['due_date']" class="text-danger">
                  {{ errors['due_date'] }}
                </small>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <label>Tình trạng hóa đơn</label>
            <select v-model="invoiceForm.status" class="form-control">
              <option value="0">Chưa thanh toán</option>
              <option value="1">Đã thanh toán</option>
              <option value="2">Đã quá hạn</option>
            </select>
            <small v-if="errors['status']" class="text-danger">
              {{ errors['status'] }}
            </small>
          </div>

          <div class="invoice-details">
            <div class="invoice-details-header">
              <span>Các Khoản Phí</span>
              <button type="button" class="btn btn-success" @click="addInvoiceDetail">+ Thêm Khoản Phí</button>
            </div>

            <div v-for="(detail, index) in invoiceDetailForm" :key="index" class="invoice-detail-row">
              <div class="row">
                <!-- Cột 1: Loại phí -->
                <div class="col-md-3">
                  <select v-model="detail.service_name" class="form-control">
                    <option value="">Chọn loại phí</option>
                    <option value="DIEN">Tiền điện</option>
                    <option value="NUOC">Tiền nước</option>
                    <option value="QUANLY">Phí quản lý</option>
                    <option value="GUIXE">Phí gửi xe</option>
                    <option value="PHIKHAC">Phí khác</option>
                  </select>
                  <small v-if="errors[`invoice_detail.${index}.service_name`]" class="text-danger">
                    {{ errors[`invoice_detail.${index}.service_name`][0] }}
                  </small>
                </div>

                <!-- Cột 2: Số lượng -->
                <div class="col-md-2">
                  <input v-model.number="detail.quantity" type="number" class="form-control" placeholder="Số lượng"
                    @input="countAmount(detail)">
                  <small v-if="errors[`invoice_detail.${index}.quantity`]" class="text-danger">
                    {{ errors[`invoice_detail.${index}.quantity`][0] }}
                  </small>
                </div>

                <!-- Cột 3: Đơn giá -->
                <div class="col-md-3">
                  <input v-model.number="detail.price" type="text" class="form-control" placeholder="Đơn giá"
                    @input="countAmount(detail)">
                  <small v-if="errors[`invoice_detail.${index}.price`]" class="text-danger">
                    {{ errors[`invoice_detail.${index}.price`][0] }}
                  </small>
                </div>

                <!-- Cột 4: Thành tiền (readonly) -->
                <div class="col-md-3">
                  <input :value="formatVND(detail.amount)" class="form-control" placeholder="Thành tiền" readonly>
                </div>

                <!-- Cột 5: Nút xóa -->
                <div class="col-md-1 text-center">
                  <button type="button" class="btn btn-danger btn-sm" @click="removeInvoiceDetail(index)">
                    Xóa
                  </button>
                </div>
              </div>
            </div>

            <div class="total-section">
              Tổng Tiền: {{ formatVND(invoiceForm.total_amount) }} VNĐ
            </div>
          </div>

          <div class="form-group d-flex" style="margin-top: 20px;">
            <button type="button" class="btn btn-secondary" @click="goBack()">Hủy bỏ</button>
            <button type="submit" class="btn btn-primary">Cập nhật</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useInvoiceStore } from '@/stores/invoice'
import { useRouter, useRoute } from 'vue-router'

definePageMeta({
  middleware: "auth",
  layout: "dashboard"
})

const invoiceStore = useInvoiceStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const isLoading = computed(() => invoiceStore.isLoading);
const invoice_id = route.params.id
const errors = ref({})
const { formatVND, unformatVND  } = useCurrencyFormat()

const invoiceForm = ref({
  apartment_number: '',
  invoice_date: '',
  due_date: '',
  total_amount: 0,
  status: 0,
  invoice_detail: []
})
const invoiceDetailForm = ref([])

const goBack = () => {
  router.push('/invoice')
}

// Tính thành tiền
const countAmount = (detail) => {
  detail.amount = detail.quantity * detail.price
  countTotalAmount()
}

// Thêm khoản phí
const addInvoiceDetail = () => {
  invoiceDetailForm.value.push({
    service_name: '',
    quantity: '',
    price: '',
    amount: 0,
    description: ''
  })
}

// Xóa khoản phí
const removeInvoiceDetail = (index) => {
  if (invoiceDetailForm.value.length > 1) {
    invoiceDetailForm.value.splice(index, 1)
    countTotalAmount()
  } else {
    toast.warning('Phải có ít nhất một khoản phí')
  }
}

// Tính tổng tiền
const countTotalAmount = () => {
  invoiceForm.value.total_amount = invoiceDetailForm.value.reduce((total, phi) => total + (phi.quantity * phi.price), 0)
}

const getInvoiceDetail = async () => {
  isLoading.value = true
  try {
    const response = await invoiceStore.fetchInvoice(invoice_id)
    console.log('response', response)
    invoiceForm.value = {
      ...response,
      invoice_detail: response.invoice_details
    }
    invoiceDetailForm.value = response.invoice_details
  } catch (error) {
    toast.error('Không tìm thấy hóa đơn!')
    router.push('/invoice')
  }
  isLoading.value = false
}

// Cập nhật hóa đơn
const updateInvoice = async () => {
  console.log(invoiceForm.value)
  isLoading.value = true
  try {
    const updateData = {
      ...invoiceForm.value,
      invoice_detail: invoiceDetailForm.value
    }
    const result = await invoiceStore.updateInvoice(invoice_id, updateData)
    if (result) {
      toast.success('Cập nhật hóa đơn thành công')
      router.push('/invoice')
    }
  } catch (error) {
    toast.error('Lỗi khi cập nhật hóa đơn: ' + error.message)
    errors.value = error.errors
  }
  isLoading.value = false
}

onMounted(() => {
  getInvoiceDetail()
})

</script>

<style scoped>
.invoice-container {
  background-color: white;
  max-width: 1140px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.invoice-header {
  text-align: center;
  margin-bottom: 30px;
}

.invoice-header h1 {
  color: #333;
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.invoice-details {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.invoice-details-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: bold;
}

.invoice-detail-row {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.btn {
  display: inline-block;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.btn:hover {
  opacity: 0.9;
}

.total-section {
  margin-top: 20px;
  text-align: right;
  font-weight: bold;
}

.d-flex {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style>
