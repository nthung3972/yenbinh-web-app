<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải thông tin cư dân...</span>
        </div>
        <p>Đang tải thông tin cư dân...</p>
    </div>

    <div v-else class="container form-container">
        <div class="card">
            <!-- Header -->
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h4 class="fw-bold text-primary">
                    <Icon name="mdi:clock-edit-outline" size="24" class="me-2" />
                    Chỉnh sửa ca làm việc
                </h4>
                <button class="btn btn-outline-secondary" @click="goBack()">
                    <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                    Quay lại
                </button>
            </div>

            <!-- Body -->
            <div class="card-body">
                <form @submit.prevent="updateShift">
                    <div class="form-section">
                        <h5 class="section-title">
                            <Icon name="mdi:information-outline" size="20" class="me-2" />
                            Thông tin ca làm việc
                        </h5>

                        <div class="row g-3">
                            <!-- Shift Name -->
                            <div class="col-md-12">
                                <div class="form-floating mb-3">
                                    <input v-model="shiftForm.name" type="text" class="form-control" id="shiftNameInput"
                                        placeholder="Nhập tên ca" @input="onChange()" />
                                    <label for="shiftNameInput">Tên ca làm việc<span
                                            class="required-mark">*</span></label>
                                    <small v-if="errors?.['name']" class="text-danger">
                                        {{ errors?.['name'][0] }}
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
                                        <option value="" disabled>Chọn tòa nhà</option>
                                        <option v-for="building in buildings" :key="building.building_id"
                                            :value="building.building_id">
                                            {{ building.name }}
                                        </option>
                                    </select>
                                    <label for="buildingSelect">Tòa nhà<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['building_id']" class="text-danger">
                                        {{ errors?.['building_id'][0] }}
                                    </small>
                                </div>
                            </div>

                            <!-- Shift Type -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <select v-model="shiftForm.type" class="form-select" id="shiftTypeSelect"
                                        @change="onChange()">
                                        <option value="" disabled>Chọn loại ca</option>
                                        <option v-for="(label, value) in shiftTypes" :key="value" :value="value">
                                            {{ label }}
                                        </option>
                                    </select>
                                    <label for="shiftTypeSelect">Loại ca<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['type']" class="text-danger">
                                        {{ errors?.['type'][0] }}
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
                                    <small v-if="errors?.['start_time']" class="text-danger">
                                        {{ errors?.['start_time'][0] }}
                                    </small>
                                </div>
                            </div>

                            <!-- End Time -->
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input v-model="shiftForm.end_time" type="time" class="form-control"
                                        id="endTimeInput" @input="onChange()" />
                                    <label for="endTimeInput">Giờ kết thúc<span class="required-mark">*</span></label>
                                    <small v-if="errors?.['end_time']" class="text-danger">
                                        {{ errors?.['end_time'][0] }}
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
                                    <small v-if="errors?.['description']" class="text-danger">
                                        {{ errors?.['description'][0] }}
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
                            <Icon name="mdi:content-save-edit-outline" size="20" class="me-2" />
                            Cập nhật ca làm việc
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <ConfirmNavigationModal v-model="showConfirmModal" @confirm="confirmNavigation" @cancel="cancelNavigation" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useShiftStore } from '@/stores/shift';
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue';
import { useInitialData } from '@/composables/useInitialData';
import { useToast } from 'vue-toastification';

definePageMeta({
    middleware: "auth",
    layout: "dashboard",
    parent: '/shift',
    intermediates: [
        { label: 'Chỉnh sửa', to: null }
    ],
    useShiftName: true

})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const shiftStore = useShiftStore()
const errors = ref({})
const { buildings } = useInitialData()

const shift_id = route.params.id

const shiftForm = ref({
    building_id: '',
    name: '',
    start_time: '',
    end_time: '',
    type: '',
    description: ''
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

const shiftTypes = {
  technical: 'Kỹ thuật',
  clean: 'Vệ sinh',
  administrative: 'Hành chính',
  security: 'Bảo vệ'
}

const goBack = () => {
    router.back()
}

const isLoading = computed(() => shiftStore.isLoading);

const fetchShift = async () => {
    await shiftStore.fetchShift(shift_id)
    const shiftData = shiftStore.shift
    shiftForm.value = {
        building_id: shiftData.building_id,
        name: shiftData.name,
        start_time: shiftData.start_time,
        end_time: shiftData.end_time,
        type: shiftData.type,
        description: shiftData.description
    }
}

const updateShift = async () => {
    try {
        await shiftStore.updateShift(shift_id, shiftForm.value)
        toast.success('Cập nhật ca làm việc thành công!')
        setEditing(false)
        errors.value = {}
    } catch (error) {
        errors.value = error.errors
        toast.error('Đã xảy ra lỗi khi cập nhật ca làm việc.')
    }
}

onMounted(() => {
    fetchShift()
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
    padding: 1.5rem;
}

.form-label {
    font-weight: 600;
    color: #495057;
    margin-bottom: 0.5rem;
}

.form-control-custom,
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
