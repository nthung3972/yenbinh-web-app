<template>
  <div class="container">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải dữ liệu...</span>
      </div>
      <p class="text-muted mt-2">Đang tải dữ liệu...</p>
    </div>

    <!-- Form Content -->
    <div v-else class="card shadow-lg border-0 p-3" style="border-radius: 12px;">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold text-primary">
          <Icon name="mdi:receipt-text" size="24" class="me-2" />
          Thêm xe mới
        </h4>
        <button class="btn btn-outline-secondary" @click="goBack">
          <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
          Quay lại
        </button>
      </div>

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
              <!-- THÔNG TIN XE -->
              <h6 class="fw-bold mb-3 text-primary">Thông tin xe</h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-medium">Biển số xe <span class="text-danger">*</span></label>
                  <input v-model="vehicle.license_plate" type="text" class="form-control shadow-sm"
                    :class="{ 'is-invalid': errors?.[`${index}.license_plate`] }" placeholder="Nhập biển số xe"
                    @input="onChange()" required />
                  <div v-if="errors?.[`${index}.license_plate`]" class="invalid-feedback">
                    {{ errors[`${index}.license_plate`][0] }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-medium">Loại xe <span class="text-danger">*</span></label>
                  <select v-model="vehicle.vehicle_type" class="form-select shadow-sm"
                    :class="{ 'is-invalid': errors?.[`${index}.vehicle_type`] }" @change="onChange()" required>
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
                  <label class="form-label fw-medium">Hãng xe <span class="text-danger">*</span></label>
                  <input v-model="vehicle.vehicle_company" type="text" class="form-control shadow-sm"
                    :class="{ 'is-invalid': errors?.[`${index}.vehicle_company`] }" placeholder="Nhập tên hãng xe"
                    @input="onChange()" />
                  <div v-if="errors?.[`${index}.vehicle_company`]" class="invalid-feedback">
                    {{ errors[`${index}.vehicle_company`][0] }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-medium">Mẫu xe <span class="text-danger">*</span></label>
                  <input v-model="vehicle.vehicle_model" type="text" class="form-control shadow-sm"
                    :class="{ 'is-invalid': errors?.[`${index}.vehicle_model`] }" placeholder="Nhập tên mẫu xe"
                    @input="onChange()" />
                  <div v-if="errors?.[`${index}.vehicle_model`]" class="invalid-feedback">
                    {{ errors[`${index}.vehicle_model`][0] }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-medium">Màu xe <span class="text-danger">*</span></label>
                  <input v-model="vehicle.vehicle_color" type="text" class="form-control shadow-sm"
                    :class="{ 'is-invalid': errors?.[`${index}.vehicle_color`] }" placeholder="Nhập tên màu xe"
                    @input="onChange()" />
                  <div v-if="errors?.[`${index}.vehicle_color`]" class="invalid-feedback">
                    {{ errors[`${index}.vehicle_color`][0] }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-medium">Vị trí đỗ</label>
                  <input v-model="vehicle.parking_slot" type="text" class="form-control shadow-sm"
                    :class="{ 'is-invalid': errors?.[`${index}.parking_slot`] }" placeholder="Nhập vị trí đỗ (nếu có)"
                    @input="onChange()" />
                  <div v-if="errors?.[`${index}.parking_slot`]" class="invalid-feedback">
                    {{ errors[`${index}.parking_slot`][0] }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-medium">Trạng thái <span class="text-danger">*</span></label>
                  <select v-model="vehicle.status" class="form-select shadow-sm"
                    :class="{ 'is-invalid': errors?.[`${index}.status`] }" @change="onChange()" required>
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
                    :class="{ 'is-invalid': errors?.[`${index}.created_at`] }" @input="onChange()" required />
                  <div v-if="errors?.[`${index}.created_at`]" class="invalid-feedback">
                    {{ errors[`${index}.created_at`][0] }}
                  </div>
                </div>
              </div>

              <hr class="my-4" />

              <!-- THÔNG TIN CHỦ XE -->
              <h5 class="fw-semibold mb-3">Thông tin chủ xe</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <!-- Mã căn hộ -->
                  <div class="col-md-6">
                    <label class="form-label">Mã căn hộ</label>
                    <input v-model="vehicle.apartment_number" @input="onApartmentInput(index)" list="apartmentList"
                      class="form-control" placeholder="Nhập mã căn hộ" />
                    <datalist id="apartmentList">
                      <option v-for="apt in filteredApartments" :key="apt.apartment_id" :value="apt.apartment_number" />
                    </datalist>
                  </div>
                  <div v-if="errors?.[`${index}.apartment_number`]" class="invalid-feedback">
                    {{ errors[`${index}.apartment_number`][0] }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-medium">Tên chủ xe <span class="text-danger">*</span></label>
                  <select v-model="vehicle.resident_id" class="form-select shadow-sm"
                    :class="{ 'is-invalid': errors?.[`${index}.resident_id`] }">
                    <option value="">Chọn cư dân</option>
                    <option v-for="resident in vehicle.residents" :key="resident.resident_id"
                      :value="resident.resident_id">
                      {{ resident.full_name }}
                    </option>
                  </select>
                  <div v-if="errors?.[`${index}.resident_id`]" class="invalid-feedback">
                    {{ errors[`${index}.resident_id`][0] }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="button" class="btn btn-outline-success mb-3" @click="addVehicle">
            <Icon name="ic:baseline-add-circle-outline" size="16" class="me-1" />
            Thêm xe
          </button>
        </fieldset>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary" style="min-width: 120px;" @click="reset()">
            Làm mới
          </button>
          <button type="submit" class="btn btn-primary" style="min-width: 120px;">
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal xác nhận chuyển hướng -->
  <ConfirmNavigationModal v-model="showConfirmModal" @confirm="confirmNavigation" @cancel="cancelNavigation" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useDashboardStore } from '@/stores/dashboard';
import { useVehicleStore } from '@/stores/vehicle';
import { useApartmentStore } from '@/stores/apartment';
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router';
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'

definePageMeta({
  middleware: "auth",
  layout: "dashboard"
})

const vehicleStore = useVehicleStore()
const apartmentStore = useApartmentStore()
const dashboardStore = useDashboardStore()
const building_id = dashboardStore.getSelectedBuildingId
const toast = useToast()
const router = useRouter()
const errors = ref({})

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

const isLoading = computed(() => vehicleStore.isLoading);

const vehicles = ref([
  {
    license_plate: '',
    vehicle_type: '',
    parking_slot: '',
    apartment_number: '',
    status: 0,
    created_at: '',
    resident_id: '',
    vehicle_company: '',
    vehicle_model: '',
    vehicle_color: '',
    building_id: building_id,
    residents: []
  }
]);

const apartments = ref([])
const filteredApartments = ref([])

const fetchApartments = async () => {
  const data = await apartmentStore.getCodeApartments(building_id)
  apartments.value = data
}

const fetchResidents = async (apartmentCode, index) => {
  const data = await apartmentStore.getResidentsByApartment(apartmentCode)
  vehicles.value[index].residents = data
}

// Khi người dùng gõ mã căn hộ
const onApartmentInput = (index) => {
  const code = vehicles.value[index].apartment_number || ''
  const lowerCode = code.toLowerCase()

  // Gợi ý các mã căn hộ khớp với đoạn người dùng gõ
  filteredApartments.value = apartments.value.filter(apt =>
    apt.apartment_number.toLowerCase().includes(lowerCode)
  )

  // Nếu mã căn hộ đúng → gọi API lấy cư dân
  const matched = apartments.value.find(apt => apt.apartment_number.toLowerCase() === lowerCode)
  if (matched) {
    fetchResidents(matched.apartment_number, index)
  } else {
    vehicles.value[index].residents = []
    vehicles.value[index].resident_id = ''
  }
}

const addVehicle = () => {
  vehicles.value.push({ license_plate: '', vehicle_type: '', parking_slot: '', apartment_number: '', status: 0, created_at: '', building_id: building_id });
};

const removeVehicle = (index) => {
  vehicles.value.splice(index, 1);
};

const reset = () => {
  vehicles.value = [
    { license_plate: '', vehicle_type: '', parking_slot: '', amapartment_numberount: '', status: 0, created_at: '' }
  ]
  setEditing(false)
}

const goBack = () => {
  router.back();
}

const createdVehicle = async () => {
  try {
    console.log(vehicles.value)
    const result = await vehicleStore.create(vehicles.value)
    if (result) {
      toast.success('Thêm danh sách xe thành công!')
      errors.value = null
      reset()
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

onMounted(() => {
  fetchApartments()
  setupRouteGuard()
})
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