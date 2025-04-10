<template>
  <div class="container">
    <div class="card shadow-lg border-0 p-4" style="border-radius: 12px;">
      <h4 class="fw-bold text-primary mb-4">Tạo hóa đơn căn hộ</h4>
      <form @submit.prevent="taoHoaDon">
        <!-- Thông tin hóa đơn -->
        <fieldset class="mb-4">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label fw-medium">Mã căn hộ <span class="text-danger">*</span></label>
              <input v-model="invoiceForm.apartment_number" type="text" class="form-control shadow-sm"
                :class="{ 'is-invalid': errors['apartment_number'] }" placeholder="Nhập mã căn hộ" required />
              <div v-if="errors['apartment_number']" class="invalid-feedback">
                {{ errors['apartment_number'] }}
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-medium">Ngày phát hành <span class="text-danger">*</span></label>
              <input v-model="invoiceForm.invoice_date" type="date" class="form-control shadow-sm"
                :class="{ 'is-invalid': errors['invoice_date'] }" required />
              <div v-if="errors['invoice_date']" class="invalid-feedback">
                {{ errors['invoice_date'] }}
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-medium">Hạn thanh toán <span class="text-danger">*</span></label>
              <input v-model="invoiceForm.due_date" type="date" class="form-control shadow-sm"
                :class="{ 'is-invalid': errors['due_date'] }" required />
              <div v-if="errors['due_date']" class="invalid-feedback">
                {{ errors['due_date'] }}
              </div>
            </div>
          </div>
        </fieldset>

        <!-- Chi tiết hóa đơn -->
        <fieldset class="mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <legend class="h5 fw-semibold text-dark mb-0">Các khoản phí</legend>
            <button type="button" class="btn btn-success d-flex align-items-center justify-content-center"
              style="white-space: nowrap;" @click="addInvoiceDetail">
              <Icon name="ic:baseline-add-circle-outline" size="16" class="me-1" /> Thêm khoản phí
            </button>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th style="width: 20%;">Loại phí</th>
                  <th style="width: 20%;">Số lượng</th>
                  <th style="width: 20%;">Đơn giá (VNĐ)</th>
                  <th style="width: 20%;">Thành tiền (VNĐ)</th>
                  <th style="width: 20%;"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(detail, index) in invoiceDetailForm" :key="index">
                  <td>
                    <select v-model="detail.service_name" class="form-select shadow-sm"
                      :class="{ 'is-invalid': errors[`invoice_detail.${index}.service_name`] }" required>
                      <option value="">Chọn loại phí</option>
                      <option value="DIEN">Tiền điện</option>
                      <option value="NUOC">Tiền nước</option>
                      <option value="QUANLY">Phí quản lý</option>
                      <option value="GUIXE">Phí gửi xe</option>
                      <option value="PHIKHAC">Phí khác</option>
                    </select>
                    <div v-if="errors[`invoice_detail.${index}.service_name`]" class="invalid-feedback">
                      {{ errors[`invoice_detail.${index}.service_name`][0] }}
                    </div>
                  </td>
                  <td>
                    <input v-model.number="detail.quantity" type="number" class="form-control shadow-sm"
                      :class="{ 'is-invalid': errors[`invoice_detail.${index}.quantity`] }" placeholder="Số lượng"
                      @input="countAmount(detail)" required />
                    <div v-if="errors[`invoice_detail.${index}.quantity`]" class="invalid-feedback">
                      {{ errors[`invoice_detail.${index}.quantity`][0] }}
                    </div>
                  </td>
                  <td>
                    <input v-model.number="detail.price" type="number" class="form-control shadow-sm"
                      :class="{ 'is-invalid': errors[`invoice_detail.${index}.price`] }" placeholder="Đơn giá"
                      @input="countAmount(detail)" required />
                    <div v-if="errors[`invoice_detail.${index}.price`]" class="invalid-feedback">
                      {{ errors[`invoice_detail.${index}.price`][0] }}
                    </div>
                  </td>
                  <td>
                    <input :value="formatCurrency(detail.amount)" class="form-control shadow-sm bg-light"
                      placeholder="Thành tiền" readonly />
                  </td>
                  <td class="text-center">
                    <button type="button" class="btn btn-outline-danger btn-sm" @click="removeInvoiceDetail(index)">
                      <Icon name="mdi:delete" size="16" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="total-section text-end mt-3">
            <strong>Tổng tiền: {{ formatCurrency(invoiceForm.total_amount) }} VNĐ</strong>
          </div>
        </fieldset>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-outline-secondary" style="min-width: 120px;" @click="goBack()">
            Hủy tạo
          </button>
          <button type="submit" class="btn btn-primary" style="min-width: 120px;">
            Tạo hóa đơn
          </button>
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
  }
}

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

.total-section {
  font-size: 1.1rem;
  color: #212529;
}
</style>
