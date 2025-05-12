<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tạo căn hộ...</span>
        </div>
        <p>Đang tạo căn hộ...</p>
    </div>

    <div v-else class="container-fluid form-container animate-fade">
        <div class="card">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h4 class="fw-bold text-primary">
                    <Icon name="ion:home" size="24" class="me-2" />
                    Thêm căn hộ
                </h4>
                <button class="btn btn-outline-secondary" @click="goBack()">
                    <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                    Quay lại
                </button>
            </div>
            <div class="card-body">
                <form @submit.prevent="handleSubmit">
                    <div class="form-section">
                        <h5 class="section-title">
                            <Icon name="mdi:information" size="20" class="me-2" />Thông tin căn hộ
                        </h5>
                        <div class="row g-3">
                            <div class="col-md-12">
                                <div class="form-label-group">
                                    <input v-model="apartment.apartment_number" type="text" class="form-control"
                                        @input="onChange()" id="apartmentNumber" placeholder=" ">
                                    <label for="apartmentNumber">Số căn hộ<span class="required-mark">*</span></label>
                                    <div class="help-text">Ví dụ: A101, B202, v.v.</div>
                                    <small v-if="errors?.['apartment_number']" class="text-danger">
                                        {{ errors?.['apartment_number'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3 mt-2">
                            <div class="col-md-6">
                                <div class="form-label-group">
                                    <input v-model="apartment.floor_number" type="number" min="1" class="form-control"
                                        @input="onChange()" id="floorInput" placeholder=" ">
                                    <label for="floorInput">Số tầng<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['floor_number']" class="text-danger">
                                        {{ errors?.['floor_number'][0] }}
                                    </small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-label-group input-with-unit">
                                    <input v-model="apartment.area" type="number" min="1" step="0.01"
                                        @input="onChange()" class="form-control" id="areaInput" placeholder=" ">
                                    <span class="input-unit">m²</span>
                                    <label for="areaInput">Diện tích<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['area']" class="text-danger">
                                        {{ errors?.['area'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3 mt-2">
                            <div class="col-md-6">
                                <div class="form-label-group">
                                    <select v-model="apartment.apartment_type" class="form-select" id="typeSelect"
                                        @change="onChange()">
                                        <option value="" disabled selected>Chọn loại căn hộ</option>
                                        <option value="studio">Căn hộ studio</option>
                                        <option value="1bedroom">1 Phòng ngủ</option>
                                        <option value="2bedroom">2 Phòng ngủ</option>
                                        <option value="3bedroom">3 Phòng ngủ</option>
                                        <option value="duplex">Căn hộ thông tầng</option>
                                        <option value="penthouse">Căn hộ áp mái</option>
                                        <option value="dualkey">Căn hộ song lập</option>
                                    </select>
                                    <label for="typeSelect">Loại căn hộ<span class="required-mark"></span></label>
                                    <small v-if="errors?.['apartment_type']" class="text-danger">
                                        {{ errors?.['apartment_type'][0] }}
                                    </small>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-label-group">
                                    <select v-model="apartment.ownership_type" class="form-select" id="typeSelect"
                                        @change="onChange()">
                                        <option value="" disabled selected>Chọn loại sở hữu</option>
                                        <option value="own">Sở hữu</option>
                                        <option value="lease">Thuê</option>
                                        <option value="lease_back">Thuê lại</option>
                                        <option value="mortgage">Thế chấp</option>
                                        <option value="shared_ownership">Sở hữu chung</option>
                                    </select>
                                    <label for="typeSelect">Loại sở hữu<span class="required-mark"></span></label>
                                    <small v-if="errors?.['ownership_type']" class="text-danger">
                                        {{ errors?.['ownership_type'][0] }}
                                    </small>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-label-group">
                                    <input v-model="apartment.notes" type="text" class="form-control"
                                        @input="onChange()" id="notes" placeholder=" ">
                                    <label for="apartmentNumber">Ghi chú<span class="required-mark"></span></label>
                                    <small v-if="errors?.['notes']" class="text-danger">
                                        {{ errors?.['notes'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                        <button type="button" class="btn btn-secondary" @click="reset()">
                            <Icon name="bx:reset" size="20" class="me-2" />Làm mới
                        </button>
                        <button type="submit" class="btn btn-primary px-4">
                            <Icon name="lsicon:submit-filled" size="20" class="me-2" /> Thêm căn hộ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal xác nhận chuyển hướng -->
    <ConfirmNavigationModal v-model="showConfirmModal" @confirm="confirmNavigation" @cancel="cancelNavigation" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useApartmentStore } from '@/stores/apartment'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const apartmentStore = useApartmentStore()
const toast = useToast()
const isLoading = ref(false)
const router = useRouter()
const errors = ref({})

const apartment = ref({
    apartment_number: '',
    floor_number: '',
    area: '',
    apartment_type: '',
    ownership_type: '',
    notes: ''
})

const reset = () => {
    apartment.value.apartment_number = '',
        apartment.value.floor_number = '',
        apartment.value.area = '',
        apartment.value.ownership_type = '',
        apartment.value.apartment_type = '',
        apartment.value.notes = ''
    errors.value = ''
    setEditing(false)
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

const goBack = () => {
    router.back();
}

const handleSubmit = async () => {
    console.log("Submitting form...", apartment.value)
    isLoading.value = true
    try {
        const result = await apartmentStore.createApartment(apartment.value)
        if (result) {
            toast.success("Thêm căn hộ thành công!", { timeout: 3000 })
            setEditing(false)
            errors.value = null
            reset()
        }
    } catch (error) {
        errors.value = error.errors
        toast.error("Thêm căn hộ thất bại!", { timeout: 3000 });
    }
    isLoading.value = false
}

onMounted(() => {
    setupRouteGuard()
})
</script>

<style scoped>
.form-container {
    width: 100%;
    margin: 1rem auto;
}

.card {
    border: none;
    border-radius: 10px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.card-header {
    padding: 1.5rem;
}

.card-body {
    padding: 1rem;
}

.form-label {
    font-weight: 600;
    color: #495057;
    margin-bottom: 0.5rem;
}

.form-control,
.form-select {
    padding: 0.75rem;
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

/* Form label group để tránh đè label */
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

/* Các style cho input number với đơn vị */
.input-with-unit {
    position: relative;
}

.input-unit {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
    font-weight: 500;
    pointer-events: none;
}

/* Màu cho badge trạng thái */
.status-badge {
    padding: 0.5rem 0.75rem;
    border-radius: 50px;
    font-weight: 500;
    display: inline-block;
}

.status-available {
    background-color: #e8f5e9;
    color: #2e7d32;
}

.status-rented {
    background-color: #e3f2fd;
    color: #1565c0;
}

.status-maintenance {
    background-color: #fff3e0;
    color: #e65100;
}

.status-reserved {
    background-color: #f3e5f5;
    color: #6a1b9a;
}

/* Thêm chút hoạt ảnh cho các phần tử */
.animate-fade {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>