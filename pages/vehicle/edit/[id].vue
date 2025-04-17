<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else class="container">
        <div class="card shadow-sm p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="fw-bold text-primary">
                    <Icon name="mdi:receipt-text" size="24" class="me-2" />
                    Sửa thông tin xe
                </h4>
                <button class="btn btn-outline-secondary" @click="goBack">
                    <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                    Quay lại
                </button>
            </div>
            <form @submit.prevent="updateVehicle">

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Biển số xe</label>
                        <input type="text" class="form-control" v-model="vehicleForm.license_plate" @input="onChange">
                        <small v-if="errors?.['license_plate']" class="text-danger">
                            {{ errors?.['license_plate'][0] }}
                        </small>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label fw-medium">Loại xe <span class="text-danger">*</span></label>
                        <select v-model="vehicleForm.vehicle_type_id" class="form-select shadow-sm" @change="onChange()"
                            required>
                            <option value="" disabled>Chọn loại xe</option>
                            <option v-for="vehicle_type in vehicleTypes" :key="vehicle_type.vehicle_type_id"
                                :value="vehicle_type.vehicle_type_id">
                                {{ vehicle_type.vehicle_type_name }}
                            </option>
                        </select>
                        <small v-if="errors?.['vehicle_type_id']" class="text-danger">
                            {{ errors?.['vehicle_type_id'][0] }}
                        </small>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Hãng xe</label>
                        <input type="text" class="form-control" v-model="vehicleForm.vehicle_company" @input="onChange">
                        <small v-if="errors?.['vehicle_company']" class="text-danger">
                            {{ errors?.['vehicle_company'][0] }}
                        </small>
                    </div>

                    <div class="col-md-4 mb-3">
                        <label class="form-label">Mẫu xe</label>
                        <input type="text" class="form-control" v-model="vehicleForm.vehicle_model" @input="onChange">
                        <small v-if="errors?.['vehicle_model']" class="text-danger">
                            {{ errors?.['vehicle_model'][0] }}
                        </small>
                    </div>

                    <div class="col-md-4 mb-3">
                        <label class="form-label">Màu xe</label>
                        <input type="text" class="form-control" v-model="vehicleForm.vehicle_color" @input="onChange">
                        <small v-if="errors?.['vehicle_color']" class="text-danger">
                            {{ errors?.['vehicle_color'][0] }}
                        </small>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Vị trí đỗ</label>
                        <input type="text" class="form-control" v-model="vehicleForm.parking_slot" @input="onChange">
                        <small v-if="errors?.['parking_slot']" class="text-danger">
                            {{ errors?.['parking_slot'][0] }}
                        </small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Số căn hộ</label>
                        <input type="text" class="form-control" v-model="vehicleForm.apartment_number"
                            @input="onChange">
                        <small v-if="errors?.['apartment_number']" class="text-danger">
                            {{ errors?.['apartment_number'][0] }}
                        </small>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Trạng thái</label>
                        <select class="form-select" v-model="vehicleForm.status" @change="onChange">
                            <option :value="0">Đang hoạt động</option>
                            <option :value="1">Ngừng hoạt động</option>
                        </select>
                        <small v-if="errors?.['status']" class="text-danger">
                            {{ errors?.['status'][0] }}
                        </small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Ngày đăng ký</label>
                        <input v-model="vehicleForm.created_at" type="date" class="form-control" @input="onChange" />
                        <small v-if="errors?.['created_at']" class="text-danger">
                            {{ errors?.['created_at'][0] }}
                        </small>
                    </div>
                </div>

                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-secondary" @click="reset()">Làm mới</button>
                    <button type="submit" class="btn btn-primary me-2">Lưu thay đổi</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal xác nhận chuyển hướng -->
    <ConfirmNavigationModal v-model="showConfirmModal" @confirm="confirmNavigation" @cancel="cancelNavigation" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useVehicleStore } from '@/stores/vehicle'
import { useDashboardStore } from '@/stores/dashboard'
import { useVeicleTypeStore } from '@/stores/vehicle-type';
import { useRouter, useRoute } from 'vue-router'
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const router = useRouter()
const route = useRoute()
const toast = useToast()
const vehicleStore = useVehicleStore()
const vehicleTypeStore = useVeicleTypeStore()
const dashboardStore = useDashboardStore()
const building_id = dashboardStore.getSelectedBuildingId
const vehicle_id = route.params.id
const errors = ref({})
const originalVehicleForm = ref({})
const vehicleTypes = ref({})

const vehicleForm = ref({
    license_plate: '',
    vehicle_type_id: '',
    vehicle_color: '',
    vehicle_company: '',
    vehicle_model: '',
    parking_slot: '',
    apartment_number: '',
    status: 0,
    created_at: '',
    building_id: building_id,
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

const reset = () => {
    vehicleForm.value.license_plate = ''
    vehicleForm.value.vehicle_type = ''
    vehicleForm.value.parking_slot = ''
    vehicleForm.value.apartment_number = ''
    vehicleForm.value.status = 0,
        vehicleForm.value.created_at = ''
    setEditing(true)
}

function onChange() {
    setEditing(true)
}

const goBack = () => {
    router.back()
}

const isLoading = computed(() => vehicleStore.isLoading);

const getVehicle = async () => {
    try {
        await vehicleStore.fechVehicle(vehicle_id)
        originalVehicleForm.value = { ...vehicleStore.vehicle }
        vehicleForm.value = vehicleStore.vehicle
    } catch (error) {
        toast.error('Không tìm thấy xe!')
        router.push('/vehicle')
    }
}

const getVehicleTypes = async () => {
    const data = await vehicleTypeStore.getList()
    vehicleTypes.value = data
    console.log('vehicleTypes', vehicleTypes.value)
}

const updateVehicle = async () => {
    try {
        console.log(vehicleForm.value)
        const result = await vehicleStore.updateVehicle(vehicleForm.value, vehicle_id);
        if (result) {
            toast.success('Cập nhật dữ liệu xe thành công!')
            setEditing(false)
            router.push('/vehicle')
        }
    } catch (error) {
        if (error.data) {
            errors.value = error.data
        }
        else {
            errors.value = error.errors;
        }
        toast.error('Cập nhật dữ liệu xe thất bại!')
    }
}

onMounted(() => {
    getVehicle()
    getVehicleTypes()
    setupRouteGuard()
})
</script>

<style scoped>
.container {
    max-width: 1140px;
    margin: 0 auto;
}

.d-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
</style>