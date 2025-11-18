<template>
    <div v-if="modelValue && invoice" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">

                <div class="modal-header flex-column align-items-start">
                    <h5 class="modal-title fw-bold d-flex align-items-center mb-1">
                        <Icon name="ph:coins" size="24" class="header-icon me-2" />
                        Điều chỉnh phí hóa đơn: {{ getInvoiceNumber }}
                    </h5>

                    <!-- Thông báo thành công -->
                    <small v-if="success" class="text-success fs-6 fw-semibold ms-1">
                        {{ success }}
                    </small>

                    <button type="button" class="btn-close position-absolute end-0 top-0 mt-2 me-2"
                        @click="close"></button>
                </div>

                <!-- Body -->
                <div class="modal-body">
                    <div v-if="loading" class="text-center">
                        <div class="spinner-border spinner-border-sm me-2" role="status">
                            <span class="visually-hidden">Đang tạo điều chỉnh phí...</span>
                        </div>
                        <p>Đang tạo điều chỉnh phí...</p>
                    </div>
                    <form v-else @submit.prevent="handleSubmit" class="form-section">

                        <!-- Loại điều chỉnh -->
                        <div class="form-label-group mb-3">
                            <select v-model="form.adjustment_type" class="form-select" required>
                                <option value="" disabled>Chọn loại điều chỉnh</option>
                                <option value="discount">Khuyến mại</option>
                                <option value="waiver">Chính sách ưu đãi</option>
                                <option value="credit">Bồi thường</option>
                                <option value="penalty">Xử phạt</option>
                                <option value="extra_service">Phí phát sinh</option>
                                <option value="back_charge">Bù phí</option>
                            </select>
                            <label>Loại điều chỉnh<span class="required-mark">*</span></label>
                            <small v-if="error?.adjustment_type" class="text-danger">
                                {{ error.adjustment_type[0] }}
                            </small>
                        </div>

                        <!-- Số tiền -->
                        <div class="form-label-group mb-3">
                            <input :value="formatPrice(form.amount)" type="text" class="form-control" id="price"
                                placeholder="Nhập giá dịch vụ" @input="form.amount = handlePriceInput($event)" />
                            <label>Số tiền<span class="required-mark">*</span></label>
                            <small v-if="error?.amount" class="text-danger">
                                {{ error.amount[0] }}
                            </small>
                        </div>

                        <!-- Tiêu đề -->
                        <div class="form-label-group mb-3">
                            <input v-model="form.title" type="text" class="form-control" required />
                            <label>Tiêu đề<span class="required-mark">*</span></label>
                            <small v-if="error?.title" class="text-danger">
                                {{ error.title[0] }}
                            </small>
                        </div>

                        <!-- Mô tả -->
                        <div class="form-label-group mb-3">
                            <textarea v-model="form.description" class="form-control" rows="3"></textarea>
                            <label>Mô tả chi tiết</label>
                        </div>

                        <!-- Lý do -->
                        <div class="form-label-group mb-3">
                            <textarea v-model="form.reason" class="form-control" rows="3" required></textarea>
                            <label>Lý do<span class="required-mark">*</span></label>
                            <small v-if="error?.reason" class="text-danger">
                                {{ error.reason[0] }}
                            </small>
                        </div>

                        <!-- Áp dụng cho khoản phí (chi tiết hóa đơn) -->
                        <div class="form-label-group mb-3">
                            <select v-model="form.invoice_detail_id" class="form-select">
                                <option value="">Không áp dụng khoản phí cụ thể</option>
                                <option v-for="item in invoiceDetails" :key="item.id" :value="item.id">
                                    {{ item.fee_name }} - {{ formatMoney(item.amount) }}
                                </option>
                            </select>
                            <label>Khoản phí áp dụng</label>
                        </div>

                        <!-- Loại phí -->
                        <div class="form-label-group mb-3">
                            <select v-model="form.fee_type_id" class="form-select">
                                <option value="">Không chọn loại phí</option>
                                <option v-for="f in feeTypes" :key="f.id" :value="f.id">
                                    {{ f.name }}
                                </option>
                            </select>
                            <label>Loại phí</label>
                        </div>

                    </form>
                </div>

                <!-- Footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="close">Hủy</button>
                    <button type="submit" class="btn btn-primary" @click="handleSubmit">
                        Lưu điều chỉnh
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import { formatPrice, handlePriceInput } from '@/composables/priceFormatter';

const props = defineProps({
    modelValue: Boolean,
    invoice: Object,
    invoiceDetails: Array,
    feeTypes: Array,
    error: Object,
    success: String,
    loading: Boolean
});

const emit = defineEmits(["update:modelValue", "submit", "reset"]);

const defaultForm = {
    invoice_id: props.invoice?.invoice_id || "",
    adjustment_type: "",
    amount: "",
    title: "",
    description: "",
    reason: "",
    invoice_detail_id: "",
    fee_type_id: "",
};

const form = reactive({ ...defaultForm });

const formReset = () => {
    Object.assign(form, defaultForm);
    emit("reset");
};

const getInvoiceNumber = computed(() => {
    return props.invoice?.invoice_number
})

watch(() => props.invoice?.invoice_id, (val) => form.invoice_id = val);

function close() {
    formReset()
    emit("update:modelValue", false);
}

function handleSubmit() {
    emit("submit", { ...form });
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
.form-label-group>label {
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
