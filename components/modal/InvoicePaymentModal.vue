<template>
    <div v-if="modelValue && invoice" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <!-- Header -->
                <div class="modal-header">
                    <h5 class="modal-title fw-bold">
                        <Icon name="ph:note-pencil" class="header-icon me-2" /> Thanh toán hóa đơn {{ getInvoiceNumber }}
                    </h5>
                    <button type="button" class="btn-close" @click="close"></button>
                </div>

                <!-- Body -->
                <div class="modal-body">
                    <div v-if="isLoading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-3">Đang tải dữ liệu...</p>
                    </div>

                    <form v-else @submit.prevent="handleSubmit" novalidate class="form-section">
                        <!-- Số tiền thanh toán -->
                        <div class="form-label-group mb-3">
                            <input v-money="moneyConfig" v-model="form.amount" type="text" class="form-control"
                                id="amountInput" placeholder=" " required />
                            <label for="amountInput">
                                Số tiền thanh toán<span class="required-mark">*</span>
                            </label>
                            <small v-if="error?.amount" class="text-danger">
                                {{ error.amount[0] }}
                            </small>
                        </div>

                        <!-- Phương thức thanh toán -->
                        <div class="form-label-group mb-3">
                            <select id="paymentMethodSelect" v-model="form.payment_method" class="form-select" required>
                                <option value="" disabled>Chọn phương thức</option>
                                <option value="bank_transfer">Chuyển khoản</option>
                                <option value="cash">Tiền mặt</option>
                                <option value="qr_code">QR Code</option>
                                <option value="other">Phương thức khác</option>
                            </select>
                            <label for="paymentMethodSelect">
                                Phương thức thanh toán<span class="required-mark">*</span>
                            </label>
                            <small v-if="error?.payment_method" class="text-danger">
                                {{ error.payment_method[0] }}
                            </small>
                        </div>

                        <!-- Ngày thanh toán -->
                        <div class="form-label-group mb-3">
                            <input v-model="form.payment_date" type="date" class="form-control" id="paymentDateInput"
                                placeholder=" " required />
                            <label for="paymentDateInput">
                                Ngày thanh toán<span class="required-mark">*</span>
                            </label>
                            <small v-if="error?.payment_date" class="text-danger">
                                {{ error.payment_date[0] }}
                            </small>
                        </div>

                        <!-- Ghi chú -->
                        <div class="form-label-group mb-3">
                            <textarea v-model="form.notes" class="form-control" id="noteInput" rows="3"
                                placeholder="Nhập ghi chú ở đây..."></textarea>
                            <label for="noteInput">Ghi chú</label>
                        </div>
                    </form>
                </div>

                <!-- Footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="close">Hủy</button>
                    <button type="submit" class="btn btn-primary" @click="handleSubmit">
                        Lưu thanh toán
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch, ref, computed } from 'vue'
import { usePaymentStore } from '@/stores/payments'
import { useToast } from 'vue-toastification'

const props = defineProps({
    modelValue: Boolean,
    invoice: Object
})

const emit = defineEmits(['update:modelValue', 'submitted'])
const paymentStore = usePaymentStore()
const toast = useToast()
const isLoading = ref(false)

const form = reactive({
    amount: '',
    payment_date: '',
    payment_method: '',
    notes: ''
})

const error = ref(null)

function resetForm() {
    form.amount = ''
    form.payment_date = ''
    form.payment_method = ''
    form.notes = ''
    error.value = null
}

const moneyConfig = {
    decimal: '.',
    thousands: ',',
    prefix: '',
    suffix: '',
    precision: 0,
    masked: false,
};

const getInvoiceNumber = computed(() => {
    return props.invoice.invoice_number
})

function close() {
    emit('update:modelValue', false)
    resetForm()
}

watch(() => props.modelValue, (val) => {
    if (val) resetForm()
})

async function handleSubmit() {
    if (!props.invoice) return

    const amount = form.amount ? Number(form.amount.replace(/,/g, '')) : ''

    const data = {
        invoice_id: props.invoice.invoice_id,
        amount: amount,
        payment_date: form.payment_date,
        payment_method: form.payment_method,
        notes: form.notes
    }

    isLoading.value = true
    error.value = {}

    try {
        const result = await paymentStore.createPayment(data)
        emit('submitted', result)
        toast.success('Thêm thanh toán thành công!')
        close()
    } catch (err) {
        error.value = err.errors
        toast.error('Đã xảy ra lỗi khi thêm thanh toán!')
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.modal-content {
    border: none;
    border-radius: 10px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.modal-header {
    padding: 1.5rem;
    border-bottom: 2px solid #eaecf4;
    background: linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%);
}

.modal-title {
    color: #4e73df;
}

.modal-body {
    padding: 2rem;
    background-color: #ffffff;
}

.form-section {
    width: 100%;
}

/* Nhóm form label group */
.form-label-group {
    position: relative;
    margin-bottom: 1rem;
}

/* Label mặc định */
.form-label-group > label {
  position: absolute;
  top: -9px;
  left: 10px;
  font-size: 12px;
  font-weight: 600;
  color: #4e73df;
  background-color: white;
  padding: 0 4px;
  z-index: 2;
  pointer-events: none;
  transition: all 0.15s ease-in-out;
}

/* Khi input/textarea/select focus hoặc có dữ liệu */
.form-label-group input:focus~label,
.form-label-group input:not(:placeholder-shown)~label,
.form-label-group textarea:focus~label,
.form-label-group textarea:not(:placeholder-shown)~label,
.form-label-group select:focus~label,
.form-label-group select:valid~label,
.form-label-group select:not([value=""])~label {
    top: -10px;
    left: 10px;
    font-size: 12px;
    font-weight: 600;
    color: #4e73df;
    background-color: #fff;
    padding: 0 5px;
    z-index: 2;
}

/* Style riêng cho textarea */
textarea.form-control {
    resize: vertical;
    min-height: 100px;
}

/* Input/select cơ bản */
.form-control,
.form-select {
    border-radius: 7px;
    border: 1px solid #ced4da;
    padding: 0.75rem;
    font-size: 1rem;
    transition: all 0.2s;
    background-color: #fff;
}

.form-control:focus,
.form-select:focus {
    border-color: #4e73df;
    box-shadow: 0 0 0 0.25rem rgba(78, 115, 223, 0.25);
}

/* Required mark */
.required-mark {
    color: #dc3545;
    margin-left: 3px;
    font-weight: bold;
}

/* Errors */
.text-danger {
    display: block;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    font-weight: 500;
}

/* Buttons */
.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 2px solid #eaecf4;
    background-color: #f8f9fc;
}

.btn {
    border-radius: 7px;
    padding: 0.6rem 1.2rem;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-primary {
    background: linear-gradient(45deg, #4e73df, #224abe);
    border: none;
}

.btn-primary:hover:not(:disabled) {
    background: linear-gradient(45deg, #224abe, #1e40af);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(33, 37, 41, 0.2);
}

.btn-secondary {
    background-color: #858796;
    border: none;
    color: white;
}

.btn-secondary:hover {
    background-color: #6c757d;
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.btn-close:hover {
    transform: scale(1.1);
    opacity: 0.8;
}

/* Responsive */
@media (max-width: 576px) {
    .modal-dialog {
        margin: 0.5rem;
    }

    .modal-body {
        padding: 1.5rem;
    }

    .modal-header,
    .modal-footer {
        padding: 1rem;
    }
}
</style>
