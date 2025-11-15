<template>
    <div class="container form-container">
        <div class="card">
            <!-- Header -->
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h4 class="fw-bold text-primary">
                    <Icon name="mdi:clock-plus-outline" size="24" class="me-2" />
                    Thêm loại phí mới
                </h4>
                <button class="btn btn-outline-secondary" @click="goBack()">
                    <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                    Quay lại
                </button>
            </div>

            <!-- Body -->
            <div class="card-body">
                <form @submit.prevent="createShift">
                    <div class="form-section">
                        <h5 class="section-title">
                            <Icon name="mdi:information-outline" size="20" class="me-2" />
                            Thông tin loại phí
                        </h5>

                        <div class="row g-3">
                            <!-- Shift Name -->
                            <div class="col-md-12">
                                <div class="form-floating mb-3">
                                    <input v-model="feeForm.name" type="text" class="form-control"
                                        id="feeNameInput" placeholder="Nhập tên ca" @input="onChange()" />
                                    <label for="feeNameInput">Tên loại phí<span
                                            class="required-mark">*</span></label>
                                    <small v-if="errors?.['name']" class="text-danger">
                                        {{ errors['name'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3">
                            <!-- Building -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <select v-model="feeForm.code" class="form-select" id="feeCode"
                                        @change="onChange()">
                                        <option value="" disabled selected>Chọn mã</option>
                                        <option value="FEE_MANAGEMENT">Phí quản lý</option>
                                        <option value="FEE_PARKING">Phí gửi xe</option>
                                        <option value="FEE_BQT">Phí Ban quản trị</option>
                                    </select>
                                    <label for="feeCode">Mã loại phí<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['code']" class="text-danger">
                                        {{ errors['code'][0] }}
                                    </small>
                                </div>
                            </div>

                            <!-- Shift Type -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input v-model="feeForm.unit" type="text" class="form-control"
                                        id="shiftNameInput" placeholder="Nhập tên ca" @input="onChange()" />
                                    <label for="shiftNameInput">Đơn vị tính<span
                                            class="required-mark">*</span></label>
                                    <small v-if="errors?.['unit']" class="text-danger">
                                        {{ errors['unit'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3">
                             <!-- Building -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <select v-model="feeForm.calculation_method" class="form-select" id="feeMethod"
                                        @change="onChange()">
                                        <option value="" disabled selected>Chọn phương thức</option>
                                        <option value="fixed">Cố định</option>
                                        <option value="per_unit">Theo đơn vị</option>
                                        <option value="custom">Tùy chỉnh</option>
                                    </select>
                                    <label for="feeMethod">Phương thức tính<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['calculation_method']" class="text-danger">
                                        {{ errors['calculation_method'][0] }}
                                    </small>
                                </div>
                            </div>

                             <!-- Building -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <select v-model="feeForm.status" class="form-select" id="feeStatus"
                                        @change="onChange()">
                                        <option value="" disabled selected>Chọn trạng thái</option>
                                        <option :value="1">Đang áp dụng</option>
                                        <option :value="0">Ngừng áp dụng</option>
                                    </select>
                                    <label for="feeStatus">Trạng thái phí<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['is_active']" class="text-danger">
                                        {{ errors['is_active'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3">
                            <!-- Description -->
                            <div class="col-md-12">
                                <div class="form-floating mb-3">
                                    <textarea v-model="feeForm.description" class="form-control" id="descInput"
                                        style="height: 100px" placeholder="Nhập mô tả" @input="onChange()"></textarea>
                                    <label for="descInput">Mô tả loại phí</label>
                                    <small v-if="errors?.['description']" class="text-danger">
                                        {{ errors['description'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Buttons -->
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button type="button" class="btn btn-secondary" @click="reset()">
                            <Icon name="system-uicons:reset" size="20" class="me-2" />
                            Làm mới
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <Icon name="mingcute:save-line" size="20" class="me-2" />
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <ConfirmNavigationModal v-model="showConfirmModal" @confirm="confirmNavigation" @cancel="cancelNavigation" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'
import { useFeeTypeStore } from '@/stores/fee-type'

definePageMeta({
    middleware: "auth",
    layout: "dashboard",
    parent: '/fee-type',
    breadcrumb: 'Thêm loại phí mới',
})

const errors = ref({})
const toast = useToast()
const router = useRouter()
const feeTypeStore = useFeeTypeStore()

const feeForm = ref({
    code: '',
    name: '',
    unit: '',
    calculation_method: '',
    description: '',
    status: '',
})

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
    feeForm.value = {
        code: '',
        name: '',
        unit: '',
        calculation_method: '',
        description: '',
        status: '',
    }
    errors.value = ''
    setEditing(false)
}

const goBack = () => {
    router.back();
}

const createShift = async () => {
    console.log('feeForm', feeForm.value);
    try {
        await feeTypeStore.createFeeType(feeForm.value)
        toast.success('Thêm loại phí thành công!')
        setEditing(false)
        reset()
    } catch (error) {
        errors.value = error.errors
        toast.error('Đã xảy ra lỗi khi thêm loại phí!')
    }
}

onMounted(() => {
    setupRouteGuard()
})
</script>

<style scoped>
.form-container {
    max-width: 800px;
    margin: 0 auto;
}

.card {
    border: none;
    border-radius: 10px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.card-header {
    padding: 1.5rem;
    border-bottom: 2px solid #eaecf4;
}

.card-body {
    padding: 2rem;
}

.form-label {
    font-weight: 600;
    color: #495057;
    margin-bottom: 0.5rem;
}

.form-control,
.form-select {
    border-radius: 7px;
    border: 1px solid #ced4da;
    transition: all 0.2s;
}

.form-control:focus,
.form-select:focus {
    border-color: #4e73df;
    box-shadow: 0 0 0 0.25rem rgba(78, 115, 223, 0.25);
}

.input-group-text {
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    border-radius: 7px 0 0 7px;
}

.btn-primary {
    background: linear-gradient(45deg, #4e73df, #224abe);
    border: none;
    padding: 0.75rem;
    font-weight: 600;
    border-radius: 7px;
    transition: all 0.3s;
}

.btn-primary:hover {
    background: linear-gradient(45deg, #224abe, #1e40af);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(33, 37, 41, 0.2);
}

.required-mark {
    color: #dc3545;
    margin-left: 3px;
}

.help-text {
    font-size: 0.8rem;
    color: #6c757d;
    margin-top: 0.25rem;
}

.header-icon {
    margin-right: 10px;
}

.form-section {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 1.1rem;
    color: #4e73df;
    border-bottom: 2px solid #eaecf4;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
}

/* Sửa lỗi đè label */
.form-label-group {
    position: relative;
    margin-bottom: 1rem;
}

.form-label-group>label {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    margin-bottom: 0;
    padding: 0.75rem;
    color: #495057;
    pointer-events: none;
    cursor: text;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    transition: all 0.1s ease-in-out;
}

.form-label-group input:focus~label,
.form-label-group input:not(:placeholder-shown)~label,
.form-label-group textarea:focus~label,
.form-label-group textarea:not(:placeholder-shown)~label,
.form-label-group select:focus~label,
.form-label-group select:not(:placeholder-shown)~label {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    font-size: 12px;
    color: #4e73df;
    background-color: white;
    top: -10px;
    left: 10px;
    z-index: 1;
    padding-left: 5px;
    padding-right: 5px;
}
</style>
