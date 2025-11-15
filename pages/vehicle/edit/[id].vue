<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else class="container-fluid">
        <div class="card shadow-sm p-4">
            <div class="d-flex justify-content-between align-items-center border-bottom mb-4 pb-4">
                <h4 class="fw-bold text-primary">
                    <Icon name="mdi:car" size="24" class="me-2" />
                    Sửa thông tin xe
                </h4>
                <button class="btn btn-outline-secondary" @click="goBack">
                    <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                    Quay lại
                </button>
            </div>

            <form @submit.prevent="updateVehicle">
                <h5 class="fw-bold text-primary border-bottom mb-3 pb-3">
                    Thông tin xe
                </h5>
                <div class="row">
                    <div class="col-md-6 mb-4">
                        <label class="form-label fw-medium">Biển số xe <span class="text-danger">*</span></label>
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
                                {{ vehicle_type.name }}
                            </option>
                        </select>
                        <small v-if="errors?.['vehicle_type_id']" class="text-danger">
                            {{ errors?.['vehicle_type_id'][0] }}
                        </small>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label class="form-label fw-medium">Hãng xe</label>
                        <input type="text" class="form-control" v-model="vehicleForm.vehicle_company" @input="onChange">
                        <small v-if="errors?.['vehicle_company']" class="text-danger">
                            {{ errors?.['vehicle_company'][0] }}
                        </small>
                    </div>

                    <div class="col-md-4 mb-3">
                        <label class="form-label fw-medium">Mẫu xe</label>
                        <input type="text" class="form-control" v-model="vehicleForm.vehicle_model" @input="onChange">
                        <small v-if="errors?.['vehicle_model']" class="text-danger">
                            {{ errors?.['vehicle_model'][0] }}
                        </small>
                    </div>

                    <div class="col-md-4 mb-3">
                        <label class="form-label fw-medium">Màu xe</label>
                        <input type="text" class="form-control" v-model="vehicleForm.vehicle_color" @input="onChange">
                        <small v-if="errors?.['vehicle_color']" class="text-danger">
                            {{ errors?.['vehicle_color'][0] }}
                        </small>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-medium">Vị trí đỗ</label>
                        <input type="text" class="form-control" v-model="vehicleForm.parking_slot" @input="onChange">
                        <small v-if="errors?.['parking_slot']" class="text-danger">
                            {{ errors?.['parking_slot'][0] }}
                        </small>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-medium">Trạng thái</label>
                        <select class="form-select" v-model="vehicleForm.status" @change="onChange">
                            <option :value="0">Đang hoạt động</option>
                            <option :value="1">Ngừng hoạt động</option>
                        </select>
                        <small v-if="errors?.['status']" class="text-danger">
                            {{ errors?.['status'][0] }}
                        </small>
                    </div>


                </div>

                <!-- THÔNG TIN CHỦ XE -->
                <h6 class="fw-bold mb-3 text-primary">THÔNG TIN CHỦ XE</h6>
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <!-- Mã căn hộ -->
                        <label class="form-label fw-medium">Mã căn hộ<span class="text-danger">*</span></label>
                        <input v-model="vehicleForm.apartment_number" @input="onApartmentInput()" list="apartmentList"
                            class="form-control" placeholder="Nhập mã căn hộ"
                            :class="{ 'is-invalid': errors?.['apartment_number'] }" />
                        <datalist id="apartmentList">
                            <option v-for="apt in filteredApartments" :key="apt.apartment_number"
                                :value="apt.apartment_number" />
                        </datalist>
                        <div v-if="errors?.['apartment_number']" class="invalid-feedback">
                            {{ errors['apartment_number'][0] }}
                        </div>

                    </div>

                    <div class="col-md-4">
                        <label class="form-label fw-medium">Tên chủ xe <span class="text-danger">*</span></label>
                        <select v-model="vehicleForm.resident_id" class="form-select shadow-sm"
                            :class="{ 'is-invalid': errors?.['resident_id'] }">
                            <option value="">Chọn cư dân</option>
                            <option v-for="resident in vehicleForm.residents" :key="resident.resident_id"
                                :value="resident.resident_id">
                                {{ resident.full_name }}
                            </option>
                        </select>
                        <div v-if="errors?.['resident_id']" class="invalid-feedback">
                            {{ errors['resident_id'][0] }}
                        </div>
                    </div>

                    <div class="col-md-4">
                        <!-- Mã căn hộ -->
                        <label class="form-label fw-medium">Ghi chú</label>
                        <input v-model="vehicleForm.note" list="apartmentList" class="form-control"
                            placeholder="Ghi chú phương tiện" />
                        <div v-if="errors?.['note']" class="invalid-feedback">
                            {{ errors['note'][0] }}
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-secondary" @click="reset()">
                        <Icon name="bx:reset" size="20" class="me-1" />Làm mới
                    </button>
                    <button type="submit" class="btn btn-primary me-2">
                        <Icon name="material-symbols-light:box-edit" size="20" class="me-1" />Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal xác nhận chuyển hướng -->
    <ConfirmNavigationModal v-model="showConfirmModal" @confirm="confirmNavigation" @cancel="cancelNavigation" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

// Stores
import { useVehicleStore } from '@/stores/vehicle'
import { useDashboardStore } from '@/stores/dashboard'
import { useVeicleTypeStore } from '@/stores/vehicle-type'
import { useApartmentStore } from '@/stores/apartment'

// Components & Composables
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'
import { useUnsavedChangesGuard } from '@/composables/useUnsavedChangesGuard'

// Nuxt Page Meta
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard',
  parent: '/vehicle',
    intermediates: [
        { label: 'Chỉnh sửa xe', to: null }
    ],
    useVehicleName: true 
})

// Setup core instances
const router = useRouter()
const route = useRoute()
const toast = useToast()

// Stores
const vehicleStore = useVehicleStore()
const vehicleTypeStore = useVeicleTypeStore()
const dashboardStore = useDashboardStore()
const apartmentStore = useApartmentStore()

// Basic constants
const building_id = dashboardStore.getSelectedBuildingId
const vehicle_id = route.params.id

// State
const errors = ref({})
const originalVehicleForm = ref({})
const vehicleTypes = ref([])
const apartments = ref([])
const filteredApartments = ref([])

const vehicleForm = ref({
  license_plate: '',
  resident_id: '',
  vehicle_type_id: '',
  vehicle_color: '',
  vehicle_company: '',
  vehicle_model: '',
  parking_slot: '',
  apartment_number: '',
  status: 0,
  note: '',
  building_id: building_id,
  residents: []
})

// Unsaved changes guard
const {
  hasUnsavedChanges,
  showConfirmModal,
  setupRouteGuard,
  setEditing,
  confirmNavigation,
  cancelNavigation,
  navigateSafely
} = useUnsavedChangesGuard()

// Computed
const isLoading = computed(() => vehicleStore.isLoading)

// Watchers
const stopWatch = watch(
  () => vehicleForm.value.apartment_number,
  async (newVal) => {
    if (newVal) {
      await fetchResidents(newVal)
      stopWatch() // chạy 1 lần duy nhất
    }
  },
  { immediate: true }
)

// Methods
function onChange() {
  setEditing(true)
}

const goBack = () => router.back()

const onApartmentInput = () => {
  const code = vehicleForm.value.apartment_number || ''
  const lowerCode = code.toLowerCase()

  filteredApartments.value = apartments.value.filter(apt =>
    apt.apartment_number.toLowerCase().includes(lowerCode)
  )

  const matched = apartments.value.find(apt => apt.apartment_number.toLowerCase() === lowerCode)
  if (matched) {
    fetchResidents(matched.apartment_number)
  } else {
    vehicleForm.value.residents = []
    vehicleForm.value.resident_id = ''
  }
}

const fetchApartments = async () => {
  const data = await apartmentStore.getCodeApartments(building_id)
  apartments.value = data
}

const fetchResidents = async (apartmentCode) => {
  const data = await apartmentStore.getResidentsByApartment(apartmentCode)
  vehicleForm.value.residents = data
}

const getVehicleTypes = async () => {
  const data = await vehicleTypeStore.getList()
  vehicleTypes.value = data
}

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

const updateVehicle = async () => {
  try {
    const result = await vehicleStore.updateVehicle(vehicleForm.value, vehicle_id)
    if (result) {
      toast.success('Cập nhật dữ liệu xe thành công!')
      setEditing(false)
      router.push('/vehicle')
    }
  } catch (error) {
    errors.value = error.data || error.errors || {}
    toast.error('Cập nhật dữ liệu xe thất bại!')
  }
}

// Lifecycle
onMounted(async () => {
  await getVehicle()
  await getVehicleTypes()
  await fetchApartments()
  await setupRouteGuard()
})
</script>

<style scoped>
.d-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
</style>