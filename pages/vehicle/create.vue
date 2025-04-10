<template>
  <div class="container mt-5">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải dữ liệu...</span>
      </div>
      <p class="text-muted mt-2">Đang tải dữ liệu...</p>
    </div>

    <!-- Form Content -->
    <div v-else class="card shadow-lg border-0 p-4" style="border-radius: 12px;">
      <h4 class="fw-bold text-primary mb-4">Thêm xe mới</h4>
      <form @submit.prevent="createdVehicle">
        <!-- Danh sách xe -->
        <fieldset class="mb-4">
          <div v-for="(vehicle, index) in vehicles" :key="index" class="card mb-3 shadow-sm border-0"
            style="border-radius: 8px;">
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
              <h6 class="mb-0 fw-semibold">Xe {{ index + 1 }}</h6>
              <button v-if="vehicles.length > 1" type="button" class="btn btn-sm btn-outline-danger"
                style="padding: 0.25rem 0.5rem;" @click="removeVehicle(index)">
                <Icon name="mdi:delete" size="16" /> Xóa
              </button>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-medium">Biển số xe <span class="text-danger">*</span></label>
                  <input v-model="vehicle.license_plate" type="text" class="form-control shadow-sm"
                    :class="{ 'is-invalid': errors?.[`${index}.license_plate`] }" placeholder="Nhập biển số xe"
                    required />
                  <div v-if="errors?.[`${index}.license_plate`]" class="invalid-feedback">
                    {{ errors[`${index}.license_plate`][0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Loại xe <span class="text-danger">*</span></label>
                  <select v-model="vehicle.vehicle_type" class="form-select shadow-sm"
                    :class="{ 'is-invalid': errors?.[`${index}.vehicle_type`] }" required>
                    <option value="">Chọn loại xe</option>
                    <option value="car">Ô tô</option>
                    <option value="motorbike">Xe máy</option>
                    <option value="bicycle">Xe đạp</option>
                  </select>
                  <div v-if="errors?.[`${index}.vehicle_type`]" class="invalid-feedback">
                    {{ errors[`${index}.vehicle_type`][0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Vị trí đỗ</label>
                  <input v-model="vehicle.parking_slot" type="text" class="form-control shadow-sm"
                    :class="{ 'is-invalid': errors?.[`${index}.parking_slot`] }"
                    placeholder="Nhập vị trí đỗ (nếu có)" />
                  <div v-if="errors?.[`${index}.parking_slot`]" class="invalid-feedback">
                    {{ errors[`${index}.parking_slot`][0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Mã căn hộ <span class="text-danger">*</span></label>
                  <input v-model="vehicle.apartment_number" type="text" class="form-control shadow-sm"
                    :class="{ 'is-invalid': errors?.[`${index}.apartment_number`] }" placeholder="Nhập mã căn hộ"
                    required />
                  <div v-if="errors?.[`${index}.apartment_number`]" class="invalid-feedback">
                    {{ errors[`${index}.apartment_number`][0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Trạng thái <span class="text-danger">*</span></label>
                  <select v-model="vehicle.status" class="form-select shadow-sm"
                    :class="{ 'is-invalid': errors?.[`${index}.status`] }" required>
                    <option :value="0">Đang hoạt động</option>
                    <option :value="1">Ngừng hoạt động</option>
                  </select>
                  <div v-if="errors?.[`${index}.status`]" class="invalid-feedback">
                    {{ errors[`${index}.status`][0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Ngày đăng ký <span class="text-danger">*</span></label>
                  <input v-model="vehicle.created_at" type="date" class="form-control shadow-sm"
                    :class="{ 'is-invalid': errors?.[`${index}.created_at`] }" required />
                  <div v-if="errors?.[`${index}.created_at`]" class="invalid-feedback">
                    {{ errors[`${index}.created_at`][0] }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-outline-success mb-3" @click="addVehicle">
            <Icon name="ic:baseline-add-circle-outline" size="16" class="me-1" /> Thêm xe
          </button>
        </fieldset>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-outline-secondary" style="min-width: 120px;" @click="goBack()">
            Hủy
          </button>
          <button type="submit" class="btn btn-primary" style="min-width: 120px;">
            Thêm danh sách xe
          </button>
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
      errors.value = error.data
    }
    else {
      errors.value = error.errors;
    }
    toast.error('Thêm danh sách xe thất bại!')
  }
};
</script>

<style scoped>
.form-label {
  font-size: 0.95rem;
  color: #495057;
}

.form-control,
.form-select {
  border-radius: 8px;
  padding: 0.5rem 1rem;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  font-size: 0.85rem;
}

.card-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e9ecef;
}

.btn {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
}

.btn:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>