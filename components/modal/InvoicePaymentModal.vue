<template>
    <div v-if="paymentStore.selectedInvoice"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
                Thêm thanh toán cho hóa đơn #{{ paymentStore.selectedInvoice.invoice_id }}
            </h3>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Amount -->
                <div>
                    <label for="amount" class="block text-sm font-medium text-gray-700">Số tiền</label>
                    <input id="amount" v-model.number="form.amount" type="number" min="0.01" step="0.01"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required />
                </div>

                <!-- Payment Date -->
                <div>
                    <label for="payment_date" class="block text-sm font-medium text-gray-700">Ngày thanh toán</label>
                    <input id="payment_date" v-model="form.payment_date" type="datetime-local"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required />
                </div>

                <!-- Payment Method -->
                <div>
                    <label for="payment_method" class="block text-sm font-medium text-gray-700">Phương thức thanh
                        toán</label>
                    <select id="payment_method" v-model="form.payment_method"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        <option value="">Chọn phương thức</option>
                        <option value="bank_transfer">Chuyển khoản</option>
                        <option value="cash">Tiền mặt</option>
                        <option value="qr_code">QR code</option>
                        <option value="other">Phương thức khác</option>
                    </select>
                </div>

                <!-- Note -->
                <div>
                    <label for="note" class="block text-sm font-medium text-gray-700">Ghi chú</label>
                    <textarea id="note" v-model="form.note" rows="4"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                </div>

                <!-- Error Message -->
                <div v-if="paymentStore.error" class="text-red-600 text-sm">{{ paymentStore.error }}</div>

                <!-- Buttons -->
                <div class="flex justify-end space-x-3">
                    <button type="button" @click="paymentStore.clearSelectedInvoice"
                        class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                        Hủy
                    </button>
                    <button type="submit" :disabled="paymentStore.loading"
                        class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-400">
                        {{ paymentStore.loading ? 'Đang xử lý...' : 'Tạo thanh toán' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePaymentStore } from '@/stores/payments'

const paymentStore = usePaymentStore();

// Form data
const form = ref({
    amount: null,
    payment_date: new Date().toISOString().slice(0, 16),
    payment_method: '',
    note: '',
});

// Xử lý submit form
const handleSubmit = async () => {
    try {
        const paymentData = {
            invoice_id: paymentStore.selectedInvoice.invoice_id,
            ...form.value,
        };
        await paymentStore.createPayment(paymentData);
        paymentStore.clearSelectedInvoice()
        alert('Thanh toán đã được tạo thành công!');
        paymentStore.clearSelectedInvoice();
        loadInvoices()
    } catch (err) {
        console.error(err);
    }
};
</script>