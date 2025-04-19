<template>
    <div class="container">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang lấy danh sách căn hộ...</span>
            </div>
            <p class="text-muted mt-2">Đang lấy danh sách căn hộ...</p>
        </div>

        <!-- Form Content -->
        <div v-else class="card shadow-lg border-0 p-4" style="border-radius: 12px;">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="fw-bold text-primary">
                    <Icon name="mdi:receipt-text" size="24" class="me-2" />
                    Thêm cư dân
                </h4>
                <button class="btn btn-outline-secondary" @click="goBack()">
                    <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                    Quay lại
                </button>
            </div>
            <form @submit.prevent="handleSubmit">
                <!-- Thông tin cư dân -->
                <fieldset class="mb-4">
                    <legend class="h5 fw-semibold text-dark mb-3">Thông tin cư dân</legend>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Họ và tên <span class="text-danger">*</span></label>
                            <input v-model="residentForm.full_name" type="text" class="form-control shadow-sm"
                                :class="{ 'is-invalid': errors?.full_name }" placeholder="Nhập họ và tên"
                                @input="onChange()" />
                            <div v-if="errors?.full_name" class="invalid-feedback">{{ errors.full_name }}</div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Căn cước công dân</label>
                            <input v-model="residentForm.id_card_number" class="form-control shadow-sm"
                                :class="{ 'is-invalid': errors?.id_card_number }" @input="onChange()"
                                placeholder="Nhập số CCCD (nếu có)" />
                            <div v-if="errors?.id_card_number" class="invalid-feedback">{{ errors.id_card_number }}
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Ngày sinh </label>
                            <input v-model="residentForm.date_of_birth" type="date" class="form-control shadow-sm"
                                :class="{ 'is-invalid': errors?.date_of_birth }" @input="onChange()" />
                            <div v-if="errors?.date_of_birth" class="invalid-feedback">{{ errors.date_of_birth }}</div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Giới tính<span class="text-danger">*</span></label>
                            <div class="d-flex gap-3">
                                <div class="form-check">
                                    <input v-model="residentForm.gender" class="form-check-input" type="radio"
                                        value="Nam" id="genderMale" @input="onChange()" />
                                    <label class="form-check-label" for="genderMale">Nam</label>
                                </div>
                                <div class="form-check">
                                    <input v-model="residentForm.gender" class="form-check-input" type="radio"
                                        value="Nữ" id="genderFemale" @input="onChange()" />
                                    <label class="form-check-label" for="genderFemale">Nữ</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Số điện thoại</label>
                            <input v-model="residentForm.phone_number" type="tel" class="form-control shadow-sm"
                                :class="{ 'is-invalid': errors?.phone_number }" @input="onChange()"
                                placeholder="Nhập số điện thoại" />
                            <div v-if="errors?.phone_number" class="invalid-feedback">{{ errors.phone_number }}</div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Email</label>
                            <input v-model="residentForm.email" type="email" class="form-control shadow-sm"
                                :class="{ 'is-invalid': errors?.email }" @input="onChange()" placeholder="Nhập email" />
                            <div v-if="errors?.email" class="invalid-feedback">{{ errors.email }}</div>
                        </div>
                    </div>
                </fieldset>

                <!-- Thông tin căn hộ -->
                <fieldset class="mb-4">
                    <legend class="h5 fw-semibold text-dark mb-3">Thông tin căn hộ</legend>
                    <div v-if="errors?.apartments" class="alert alert-danger mb-3">{{ errors.apartments }}</div>
                    <div v-for="(apartment, index) in defaultApartment" :key="index"
                        class="card mb-3 shadow-sm border-0" style="border-radius: 8px;">
                        <div class="card-header bg-light d-flex justify-content-between align-items-center">
                            <h6 class="mb-0 fw-semibold">Căn hộ {{ index + 1 }}</h6>
                            <button v-if="defaultApartment.length > 1" @click.prevent="removeResident(index)"
                                class="btn btn-sm btn-outline-danger" style="padding: 0.25rem 0.5rem;">
                                <Icon name="mdi:delete" size="16" /> Xóa
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label fw-medium">Mã căn hộ <span
                                            class="text-danger">*</span></label>
                                    <select id="apartment" v-model="apartment.apartment_number" class="form-select">
                                        <option value="" disabled>Chọn một căn hộ</option>
                                        <option v-for="apartment in apartments" :key="apartment.apartment_id"
                                            :value="apartment.apartment_number">
                                            {{ apartment.apartment_number }}
                                        </option>
                                    </select>
                                    <div v-if="errors?.[`apartments.${index}.apartment_number`]"
                                        class="invalid-feedback">
                                        Lỗi khi nhập mã căn hộ</div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-medium">Vai trò <span
                                            class="text-danger">*</span></label>
                                    <select v-model="apartment.role_in_apartment" class="form-select shadow-sm"
                                        :class="{ 'is-invalid': errors?.apartments }" @change="onChange()">
                                        <option value="">Vai trò trong căn hộ</option>
                                        <option value="0">Chủ hộ</option>
                                        <option value="1">Người thuê chính</option>
                                        <option value="2">Người thân</option>
                                    </select>
                                    <div v-if="errors?.[`apartments.${index}.role_in_apartment`]"
                                        class="invalid-feedback">
                                        Lỗi khi chọn vai trò trong căn hộ</div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label fw-medium">Quan hệ với người sở hữu <span
                                            class="text-danger">*</span></label>
                                    <input v-model="apartment.notes" type="text" class="form-control shadow-sm"
                                        @input="onChange()" placeholder="Ghi rõ mối quan hệ với người sở hữu căn hộ"
                                        :class="{ 'is-invalid': errors?.notes }" />
                                    <div v-if="errors?.[`apartments.${index}.notes`]" class="invalid-feedback">
                                        Lỗi khi chọn vai trò trong căn hộ</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-outline-success mb-3" @click="addResident">
                        <Icon name="ic:baseline-add-circle-outline" size="16" class="me-1" /> Thêm căn hộ
                    </button>
                </fieldset>

                <!-- Action Buttons -->
                <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-outline-secondary" style="min-width: 120px;" @click="reset()">
                        Làm mới
                    </button>
                    <button type="submit" class="btn btn-primary" style="min-width: 120px;" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Đang thêm...' : 'Thêm cư dân' }}
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal xác nhận chuyển hướng -->
    <ConfirmNavigationModal v-model="showConfirmModal" @confirm="confirmNavigation" @cancel="cancelNavigation" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useResidentStore } from '@/stores/resident'
import { useApartmentStore } from '@/stores/apartment'
import { useDashboardStore } from '@/stores/dashboard'
import { useToast } from 'vue-toastification';
import { useFormErrors } from '~/composables/useFormErrors'
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const router = useRouter()
const useResident = useResidentStore()
const useApartment = useApartmentStore()
const dashboardStore = useDashboardStore()
const toast = useToast()
const { formatErrors } = useFormErrors()
const errors = ref({})
const isLoading = ref(false)
const apartments = ref([])
const building_id = dashboardStore.getSelectedBuildingId;

const residentForm = ref({
    full_name: '',
    id_card_number: '',
    date_of_birth: '',
    gender: 'Nam',
    phone_number: '',
    email: '',
    apartments: [],
})

const defaultApartment = ref([
    { apartment_number: '', role_in_apartment: '', notes: '' }
])

// const apartments = ref([defaultApartment()])
const isSubmitting = ref(false)

const reset = () => {
    residentForm.value.full_name = ''
    residentForm.value.id_card_number = ''
    residentForm.value.date_of_birth = ''
    residentForm.value.gender = 'Nam'
    residentForm.value.phone_number = ''
    residentForm.value.email = ''

    defaultApartment.value = [
        { apartment_number: '', role_in_apartment: '', notes: '' }
    ]

    setEditing(false)
    errors.value = null
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

// Thêm một cư dân mới
const addResident = () => {
    defaultApartment.value.push(
        {
            apartment_number: '',
            role_in_apartment: ''
        }
    )
}

// Xóa cư dân khỏi danh sách
const removeResident = (index) => {
    defaultApartment.value.splice(index, 1)
}

// Lấy danh sách căn hộ
const fetchApartments = async () => {
    try {
        const data = await useApartment.getCodeApartments(building_id)
        apartments.value = data
    } catch (error) {
        toast.error('Lỗi khi lấy danh sách căn hộ')
    }
}

// Gửi dữ liệu lên API
const handleSubmit = async () => {
    const submissionData = {
        ...residentForm.value,
        apartments: defaultApartment.value
    }
    console.log(submissionData)
    isLoading.value = true
    try {
        const result = await useResident.createResident(submissionData);
        if (result) {
            toast.success("Thêm cư dân thành công!", { timeout: 3000 });
            errors.value = null;
            reset()
        }
    } catch (error) {
        if (error && error.errors) {
            errors.value = formatErrors(error.errors);
        } else {
            errors.value = {
                general: error.message || "Đã có lỗi xảy ra khi thêm cư dân"
            };
        }
        toast.error("Thêm cư dân thất bại!", { timeout: 3000 });
    } finally {
        isLoading.value = false;
    }
}

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
