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
                    Thêm nhân viên mới
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
                            <Icon name="mdi:information" size="20" class="me-2" />Thông tin nhân viên
                        </h5>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="form-label-group">
                                    <input v-model="personnel.personnel_name" type="text" class="form-control"
                                        @input="onChange()" id="personnelName" placeholder=" ">
                                    <label for="personnelName">Tên nhân viên<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['personnel_name']" class="text-danger">
                                        {{ errors?.['personnel_name'][0] }}
                                    </small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-label-group">
                                    <input v-model="personnel.personnel_birth" type="date" class="form-control"
                                        @input="onChange()" id="floorInput" placeholder=" ">
                                    <label for="floorInput">Ngày sinh<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['personnel_birth']" class="text-danger">
                                        {{ errors?.['personnel_birth'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3 mt-2">
                            <div class="col-md-6">
                                <div class="form-label-group input-with-unit">
                                    <input v-model="personnel.personnel_phone" type="text" @input="onChange()"
                                        class="form-control" id="personnelPhone" placeholder=" ">
                                    <label for="personnelPhone">Số điện thoại<span
                                            class="required-mark">*</span></label>
                                    <small v-if="errors?.['personnel_phone']" class="text-danger">
                                        {{ errors?.['personnel_phone'][0] }}
                                    </small>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-label-group input-with-unit">
                                    <input v-model="personnel.personnel_address" type="text" @input="onChange()"
                                        class="form-control" id="personnelAddress" placeholder=" ">
                                    <label for="personnelAddress">Địa chỉ<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['personnel_phone']" class="text-danger">
                                        {{ errors?.['personnel_phone'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h5 class="section-title">
                            <Icon name="mdi:information" size="20" class="me-2" />Thông tin công việc
                        </h5>
                        <div class="row g-3 mt-2">
                            <div class="col-md-6">
                                <div class="form-label-group">
                                    <select v-model="personnel.position" class="form-select" id="typeSelect"
                                        @change="onChange()">
                                        <option value="" disabled selected>Vị trí làm việc</option>
                                        <option value="accountant">Kế toán</option>
                                        <option value="cleaner">Vệ sinh</option>
                                        <option value="security">Bảo vệ</option>
                                        <option value="receptionist">Lễ tân</option>
                                        <option value="technical">Kỹ thuật</option>
                                        <option value="supervisor">Giám sát</option>
                                        <option value="assistant_manager">Phó trưởng BQL</option>
                                        <option value="manager">Trưởng BQL</option>
                                    </select>
                                    <label for="typeSelect">Vị trí<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['position']" class="text-danger">
                                        {{ errors?.['position'][0] }}
                                    </small>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-label-group input-with-unit">
                                    <input v-money="moneyConfig" v-model="personnel.monthly_salary" type="text"
                                        @input="onChange()" class="form-control" id="monthlySalary" placeholder=" ">
                                    <label for="monthlySalary">Mức lương<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['monthly_salary']" class="text-danger">
                                        {{ errors?.['monthly_salary'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                        <button type="button" class="btn btn-secondary" @click="reset()">
                            <Icon name="bx:reset" size="20" class="me-2" />Làm mới
                        </button>
                        <button type="submit" class="btn btn-primary px-4">
                            <Icon name="lsicon:submit-filled" size="20" class="me-2" /> Lưu thay đổi
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
import { useBuildingPersonnelStore } from '@/stores/building-personnel'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const buildingPersonnelStore = useBuildingPersonnelStore()
const toast = useToast()
const isLoading = ref(false)
const router = useRouter()
const errors = ref({})

const moneyConfig = {
    prefix: '',          // Không cần tiền tố
    thousands: ',',      // Dấu phân cách hàng nghìn
    decimal: '.',        // Dấu thập phân
    precision: 0         // Không có số thập phân
}

const personnel = ref({
    personnel_name: '',
    personnel_birth: '',
    personnel_phone: '',
    personnel_address: '',
    position: '',
    monthly_salary: 0
})

const reset = () => {
    personnel.value.personnel_name = '',
    personnel.value.personnel_birth = '',
    personnel.value.personnel_phone = '',
    personnel.value.personnel_address = '',
    personnel.value.position = '',
    personnel.value.monthly_salary = 0
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
    const salary = personnel.value.monthly_salary;
    const monthly_salary = salary
        ? Number(salary.toString().replace(/,/g, ''))
        : 0;

    const payload = {
        ...personnel.value,
        monthly_salary
    };
    isLoading.value = true
    try {
        const result = await buildingPersonnelStore.create(payload)
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
    padding: 0.5rem;
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
