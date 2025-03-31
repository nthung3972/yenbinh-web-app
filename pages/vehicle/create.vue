<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else class="container">
        <div class="card shadow-sm p-4">
            <h4 class="mb-4">Thêm Xe Mới</h4>
            <form @submit.prevent="createdVehicle">
                <div v-for="(vehicle, index) in vehicles" :key="index" class="mb-4 border p-3 rounded">
                    <h6>Xe {{ index + 1 }}</h6>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Biển số xe</label>
                            <input type="text" class="form-control" v-model="vehicle.license_plate">
                            <small v-if="errors?.[`${index}.license_plate`]" class="text-danger">
                                {{ errors?.[`${index}.license_plate`][0] }}
                            </small>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Loại xe</label>
                            <select class="form-select" v-model="vehicle.vehicle_type">
                                <option value="">Chọn loại xe</option>
                                <option value="car">Ô tô</option>
                                <option value="motorbike">Xe máy</option>
                                <option value="bicycle">Xe đạp</option>
                            </select>
                            <small v-if="errors?.[`${index}.vehicle_type`]" class="text-danger">
                                {{ errors?.[`${index}.vehicle_type`][0] }}
                            </small>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Vị trí đỗ</label>
                            <input type="text" class="form-control" v-model="vehicle.parking_slot">
                            <small v-if="errors?.[`${index}.parking_slot`]" class="text-danger">
                                {{ errors?.[`${index}.parking_slot`][0] }}
                            </small>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Số căn hộ</label>
                            <input type="text" class="form-control" v-model="vehicle.apartment_number">
                            <small v-if="errors?.[`${index}.apartment_number`]" class="text-danger">
                                {{ errors?.[`${index}.apartment_number`][0] }}
                            </small>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Trạng thái</label>
                            <select class="form-select" v-model="vehicle.status">
                                <option :value="0">Đang hoạt động</option>
                                <option :value="1">Ngừng hoạt động</option>
                            </select>
                            <small v-if="errors?.[`${index}.status`]" class="text-danger">
                                {{ errors?.[`${index}.status`][0] }}
                            </small>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Ngày đăng ký</label>
                            <input v-model="vehicle.created_at" type="date" class="form-control" />
                            <small v-if="errors?.[`${index}.created_at`]" class="text-danger">
                                {{ errors?.[`${index}.created_at`][0] }}
                            </small>
                        </div>
                    </div>
                    <button type="button" class="btn btn-success me-2" @click="addVehicle">Thêm xe</button>
                    <button type="button" class="btn btn-danger" @click="removeVehicle(index)"
                        v-if="vehicles.length > 1">Xóa</button>
                </div>
                <div class="d-flex justify-content-end">
                    <button type="submit" class="btn btn-primary me-2">Lưu xe</button>
                    <button type="button" class="btn btn-secondary" @click="goBack()">Bỏ qua</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDashboardStore } from '@/stores/dashboard';
import { useVehicleStore } from '@/stores/vehicle';
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router';

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const vehicleStore = useVehicleStore()
const dashboardStore = useDashboardStore()
const building_id = dashboardStore.getSelectedBuildingId
const toast = useToast()
const router = useRouter()
const errors = ref({})

const isLoading = computed(() => vehicleStore.isLoading);

const vehicles = ref([
    { license_plate: '', vehicle_type: '', parking_slot: '', apartment_number: '', status: 0, created_at: '', building_id: building_id }
]);

const addVehicle = () => {
    vehicles.value.push({ license_plate: '', vehicle_type: '', parking_slot: '', apartment_number: '', status: 0, created_at: '', building_id: building_id });
};

const removeVehicle = (index) => {
    vehicles.value.splice(index, 1);
};

const goBack = () => {
    router.back();
}

const createdVehicle = async () => {
    try {
        const result = await vehicleStore.create(vehicles.value)
        if (result) {
            toast.success('Thêm danh sách xe thành công!')
            router.back()
        }
    } catch (error) {
        console.log('Lỗi khi thêm danh sách xe: ', error)
        if (error.data) {
            errors.value = error.data.errors
        }
        else {
            errors.value = error.errors;
        }
        toast.error('Thêm danh sách xe thất bại!')
    }
};
</script>

<style>
.container {
    max-width: 800px;
    overflow-y: auto;
    scrollbar-width: thin;
}
</style>