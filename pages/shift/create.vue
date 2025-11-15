<template>
    <div class="container form-container">
        <div class="card">
            <!-- Header -->
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h4 class="fw-bold text-primary">
                    <Icon name="mdi:clock-plus-outline" size="24" class="me-2" />
                    Thêm ca làm việc mới
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
                            Thông tin ca làm việc
                        </h5>

                        <div class="row g-3">
                            <!-- Shift Name -->
                            <div class="col-md-12">
                                <div class="form-floating mb-3">
                                    <input v-model="shiftForm.name" type="text" class="form-control"
                                        id="shiftNameInput" placeholder="Nhập tên ca" @input="onChange()" />
                                    <label for="shiftNameInput">Tên ca làm việc<span
                                            class="required-mark">*</span></label>
                                    <small v-if="errors['name']" class="text-danger">
                                        {{ errors['name'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3">
                            <!-- Building -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <select v-model="shiftForm.building_id" class="form-select" id="buildingSelect"
                                        @change="onChange()">
                                        <option value="" disabled selected>Chọn tòa nhà</option>
                                       <option v-for="building in buildings" :value="building.building_id">
                                        {{ building.name }}
                                    </option>
                                    </select>
                                    <label for="buildingSelect">Tòa nhà<span class="required-mark">*</span></label>
                                    <small v-if="errors['building_id']" class="text-danger">
                                        {{ errors['building_id'][0] }}
                                    </small>
                                </div>
                            </div>

                            <!-- Shift Type -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <select v-model="shiftForm.type" class="form-select" id="shiftTypeSelect"
                                        @change="onChange()">
                                        <option value="" disabled selected>Chọn loại ca</option>
                                        <option value="technical">Kỹ thuật</option>
                                        <option value="clean">Vệ sinh</option>
                                        <option value="administrative">Hành chính</option>
                                        <option value="security">Bảo vệ</option>
                                    </select>
                                    <label for="shiftTypeSelect">Loại ca<span class="required-mark">*</span></label>
                                    <small v-if="errors['type']" class="text-danger">
                                        {{ errors['type'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3">
                            <!-- Start Time -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input v-model="shiftForm.start_time" type="time" class="form-control"
                                        id="startTimeInput" @input="onChange()" />
                                    <label for="startTimeInput">Giờ bắt đầu<span class="required-mark">*</span></label>
                                    <small v-if="errors['start_time']" class="text-danger">
                                        {{ errors['start_time'][0] }}
                                    </small>
                                </div>
                            </div>

                            <!-- End Time -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input v-model="shiftForm.end_time" type="time" class="form-control"
                                        id="endTimeInput" @input="onChange()" />
                                    <label for="endTimeInput">Giờ kết thúc<span class="required-mark">*</span></label>
                                    <small v-if="errors['end_time']" class="text-danger">
                                        {{ errors['end_time'][0] }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3">
                            <!-- Description -->
                            <div class="col-md-12">
                                <div class="form-floating mb-3">
                                    <textarea v-model="shiftForm.description" class="form-control" id="descInput"
                                        style="height: 100px" placeholder="Nhập mô tả" @input="onChange()"></textarea>
                                    <label for="descInput">Mô tả công việc</label>
                                    <small v-if="errors['description']" class="text-danger">
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
                            Lưu ca làm việc
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
import { useInitialData } from '@/composables/useInitialData'
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'
import { useShiftStore } from '@/stores/shift'

definePageMeta({
    middleware: "auth",
    layout: "dashboard",
    parent: '/shift',
    breadcrumb: 'Thêm ca làm việc',
})

const errors = ref({})
const toast = useToast()
const router = useRouter()
const { buildings } = useInitialData()
const shiftStore = useShiftStore()

const shiftForm = ref({
    building_id: '',
    name: '',
    start_time: '',
    end_time: '',
    type: '',
    description: '',
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
    shiftForm.value = {
        building_id: '',
        name: '',
        start_time: '',
        end_time: '',
        type: '',
        description: '',
    }
    errors.value = ''
    setEditing(false)
}

const goBack = () => {
    router.back();
}

const createShift = async () => {
    console.log(shiftForm.value);
    try {
        await shiftStore.createShift(shiftForm.value)
        toast.success('Thêm ca trực thành công!')
        setEditing(false)
        reset()
    } catch (error) {
        errors.value = error.errors
        toast.error('Đã xảy ra lỗi khi thêm ca trực!')
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
