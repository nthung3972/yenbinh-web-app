<template>
    <!-- <Teleport to="body"> -->
    <div v-if="modelValue && invoice" class="modal-overlay">
        <div v-if="isLoading" class="text-center">
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Đang tải dữ liệu...</span>
            </div>
            <p>Đang tải dữ liệu...</p>
        </div>
        <div v-else class="modal-container">
            <form @submit.prevent="handleSubmit" novalidate>
                <div class="modal-header">
                    <h3 class="modal-title">Thêm Thanh Toán</h3>
                    <button class="close-btn" type="button" @click="close">×</button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label>Số tiền thanh toán<span class="text-danger">*</span></label>
                        <input v-money="moneyConfig" v-model="form.amount" type="text" required/>
                        <span v-if="error?.amount" class="error-message">{{ error.amount[0] }}</span>
                    </div>

                    <div class="form-group">
                        <label>Phương thức thanh toán<span class="text-danger">*</span></label>
                        <select id="payment_method" v-model="form.payment_method" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            <option value="">Chọn phương thức</option>
                            <option value="bank_transfer">Chuyển khoản</option>
                            <option value="cash">Tiền mặt</option>
                            <option value="qr_code">QR code</option>
                            <option value="other">Phương thức khác</option>
                        </select>
                        <span v-if="error?.payment_method" class="error-message">{{ error.payment_method[0] }}</span>
                    </div>

                    <div class="form-group">
                        <label>Ngày thanh toán<span class="text-danger">*</span></label>
                        <input v-model="form.payment_date" type="date" required />
                        <span v-if="error?.payment_date" class="error-message">{{ error.payment_date[0] }}</span>
                    </div>

                    <div class="form-group">
                        <label>Ghi chú</label>
                        <input v-model="form.notes" type="text" required />
                        <span v-if="error?.notes" class="error-message">{{ error.note }}</span>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="cancel-btn" @click="close">Hủy</button>
                    <button type="submit" class="confirm-btn">Thêm</button>
                </div>
            </form>
        </div>
    </div>
    <!-- </Teleport> -->
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
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
        console.log('Lỗi:', error.value)
        toast.error('Đã xảy ra lỗi khi thêm thanh toán!')
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-container {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    overflow: hidden;
}

.modal-header,
.modal-footer {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-body {
    padding: 16px;
}

.modal-title {
    font-size: 18px;
    font-weight: bold;
}

.close-btn {
    background: none;
    font-size: 24px;
    border: none;
    cursor: pointer;
}

.form-group {
    margin-bottom: 1rem;
}

input,
select {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #cbd5e0;
}

.error-message {
    color: #e53e3e;
    font-size: 13px;
}

.cancel-btn {
    background: #e2e8f0;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
}

.confirm-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
}
</style>
