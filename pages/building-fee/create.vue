<template>
    <div class="container form-container">
        <div v-if="isLoading" class="text-center">
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Đang tạo phí tòa nhà...</span>
            </div>
            <p>Đang tạo phí tòa nhà...</p>
        </div>
        <div v-else class="card">
            <!-- Header -->
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h4 class="fw-bold text-primary">
                    <Icon name="mdi:clock-plus-outline" size="24" class="me-2" />
                    Thêm phí tòa nhà
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
                            <span>Thông tin phí</span>
                        </h5>

                        <div class="row g-3">
                            <!-- Building -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <select v-model="buildingFee.fee_types_id" class="form-select" id="feeCode"
                                        @change="onChange(), onApartmentInput(buildingFee.fee_types_id)">
                                        <option value="" disabled>Chọn loại phí</option>
                                        <option v-for="feeType in feeTypeStore.feeTypes" :key="feeType.fee_types_id"
                                            :value="feeType.fee_types_id">
                                            {{ feeType.name }}
                                        </option>
                                    </select>
                                    <label for="feeCode">Loại phí<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['fee_types_id']" class="text-danger">
                                        {{ errors['fee_types_id'][0] }}
                                    </small>
                                </div>
                            </div>

                            <div class="col-md-6" v-if="feeSubtypeStore.feeSubtypesById.length > 0">
                                <div class="form-floating mb-3">
                                    <select v-model="buildingFee.fee_subtypes_id" class="form-select"
                                        id="apartmentSelect">
                                        <option value="" disabled selected>Chọn phí con</option>
                                        <option v-for="fee in feeSubtypeStore.feeSubtypesById" :key="fee.fee_subtypes_id"
                                            :value="fee.fee_subtypes_id">
                                            {{ fee.name }}
                                        </option>
                                    </select>
                                    <label for="apartmentSelect">Phí con<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['fee_subtypes_id']" class="text-danger">
                                        {{ errors['fee_subtypes_id'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3">
                            <!-- Shift Name -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input :value="formatPrice(buildingFee.price)" type="text" class="form-control"
                                        id="price" placeholder="Nhập giá dịch vụ" @input="onChange(), buildingFee.price = handlePriceInput($event)" />
                                    <label for="priceInput">Giá dịch vụ<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['price']" class="text-danger">
                                        {{ errors['price'][0] }}
                                    </small>
                                </div>
                            </div>

                            <!-- Shift Name -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input v-model="buildingFee.unit" type="text" class="form-control" id="unitInput"
                                        placeholder="Nhập đơn vị tính" @input="onChange()" />
                                    <label for="unitInput">Đơn vị tính<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['unit']" class="text-danger">
                                        {{ errors['unit'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3">
                            <!-- Shift Name -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input v-model="buildingFee.effective_from" type="date" class="form-control"
                                        id="start_date" placeholder="Nhập giá dịch vụ" @input="onChange()" />
                                    <label for="start_date">Ngày áp dụng<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['effective_from']" class="text-danger">
                                        {{ errors['effective_from'][0] }}
                                    </small>
                                </div>
                            </div>

                            <!-- Shift Name -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input v-model="buildingFee.effective_to" type="date" class="form-control"
                                        id="end_date" placeholder="Nhập đơn vị tính" @input="onChange()" />
                                    <label for="end_date">Ngày kết thúc</label>
                                    <small v-if="errors?.['effective_to']" class="text-danger">
                                        {{ errors['effective_to'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3">
                            <!-- Description -->
                            <div class="col-md-12">
                                <div class="form-floating mb-3">
                                    <textarea v-model="buildingFee.note" class="form-control" id="note"
                                        style="height: 100px" placeholder="Nhập mô tả" @input="onChange()"></textarea>
                                    <label for="note">Ghi chú phí</label>
                                    <small v-if="errors?.['note']" class="text-danger">
                                        {{ errors['note'][0] }}
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
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'
import { useFeeTypeStore } from '@/stores/fee-type'
import { useFeeSubtypeStore } from '@/stores/fee-subtype'
import { useInitialData } from '@/composables/useInitialData'
import { useBuildingFeeStore } from '@/stores/building-fee'
import { formatPrice, handlePriceInput } from '@/composables/priceFormatter';

definePageMeta({
    middleware: "auth",
    layout: "dashboard",
    parent: '/building-fee',
    breadcrumb: 'Thêm biểu phí',
})

const errors = ref({})
const toast = useToast()
const router = useRouter()
const feeTypeStore = useFeeTypeStore()
const feeSubtypeStore = useFeeSubtypeStore()
const buildingFeeStore = useBuildingFeeStore()
const { selectedBuildingId } = useInitialData()

const isLoading = computed(() => buildingFeeStore.isLoading);

const buildingFee = ref({
    building_id: selectedBuildingId.value,
    fee_types_id: '',
    fee_subtypes_id: '',
    price: '',
    unit: '',
    effective_from: '',
    effective_to: '',
    note: '',
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
    buildingFee.value = {
        building_id: '',
        fee_types_id: '',
        fee_subtypes_id: '',
        price: '',
        unit: '',
        effective_from: '',
        effective_to: '',
        note: '',
    }
    errors.value = ''
    setEditing(false)
}

const goBack = () => {
    router.back();
}

const onApartmentInput = async (id) => {
    await feeSubtypeStore.getByFeeTypeId(id)
}

const createShift = async () => {
    try {
        await buildingFeeStore.createBuildingFee(buildingFee.value)
        toast.success('Thêm loại phí thành công!')
        buildingFeeStore.invalidateBuildingFees()
        setEditing(false)
        router.push('/building-fee')
    } catch (error) {
        if (error.code && error.code === 403) {
            toast.error('Bạn không có quyền tạo phí tòa nhà!')
            return
        }
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
    max-width: 100%;
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
