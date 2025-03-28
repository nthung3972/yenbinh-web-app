<template>
  <div class="invoice-container container mt-4">
    <h4>Tạo hóa đơn căn hộ</h4>
    <div class="card p-4 shadow-sm">
      <form @submit.prevent="taoHoaDon">
        <div class="form-group">
          <label>Mã Căn Hộ</label>
          <input v-model="invoiceForm.apartment_number" type="text" class="form-control" placeholder="Nhập mã căn hộ">
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

        <div class="invoice-details">
          <div class="invoice-details-header">
            <span>Các Khoản Phí</span>
            <button type="button" class="btn btn-success" @click="addInvoiceDetail">
              + Thêm Khoản Phí
            </button>
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
                <input :value="formatCurrency(detail.amount)" class="form-control" placeholder="Thành tiền" readonly>
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
            Tổng Tiền: {{ invoiceForm.total_amount.toLocaleString() }} VNĐ
          </div>
        </div>

        <div class="form-group d-flex" style="margin-top: 20px;">
          <button type="submit" class="btn btn-primary">Tạo Hóa Đơn</button>
          <button type="button" class="btn btn-secondary" @click="goBack()">Bỏ tạo</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useDashboardStore } from '@/stores/dashboard'
import { useInvoiceStore } from '@/stores/invoice'
import { useRouter } from 'vue-router';

definePageMeta({
  middleware: "auth",
  layout: "dashboard"
})

const formatCurrency = (value) => {
  return value.toLocaleString('vi-VN');
};

const dashboardStore = useDashboardStore();
const invoiceStore = useInvoiceStore();
const router = useRouter()
const building_id = dashboardStore.getSelectedBuildingId;
const errors = ref({});
const toast = useToast()

const invoiceForm = ref({
  apartment_number: '',
  invoice_date: '',
  due_date: '',
  total_amount: 0,
  status: 0,
  building_id: building_id,
  invoice_detail: [],
})

const invoiceDetailForm = ref([
  { service_name: '', quantity: '', price: '', amount: 0, description: '' }
])


const goBack = () => {
    router.back();
}

// Tính thành tiền cho từng khoản phí
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
  invoiceForm.value.total_amount = invoiceDetailForm.value.reduce((total, phi) => {
    return total + (phi.quantity * phi.price)
  }, 0)
}

// Tạo hóa đơn
const taoHoaDon = async () => {
  const submissionData = {
    ...invoiceForm.value,
    invoice_detail: invoiceDetailForm.value
  }

  try {
    const result = await invoiceStore.createInvoice(submissionData)
    if (result) {
      toast.success('Tạo hóa đơn thành công')
      router.push('/invoice')
    }
  } catch (error) {
    toast.error('Lỗi khi tạo hóa đơn: ' + error.message)
    errors.value = error.errors;
    console.log('Lỗi khi tạo hóa đơn: ', error.errors)
  }
}

</script>

<style scoped>
.invoice-container {
  background-color: white;
  max-width: 100%;
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
