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
            <h4 class="fw-bold text-primary mb-4">Thêm cư dân vào căn hộ</h4>
            <form @submit.prevent="handleSubmit">
                <!-- Thông tin cư dân -->
                <fieldset class="mb-4">
                    <legend class="h5 fw-semibold text-dark mb-3">Thông tin cư dân</legend>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Họ và tên <span class="text-danger">*</span></label>
                            <input 
                                v-model="residentForm.full_name" 
                                type="text" 
                                class="form-control shadow-sm" 
                                :class="{ 'is-invalid': errors.full_name }" 
                                placeholder="Nhập họ và tên" 
                                required 
                            />
                            <div v-if="errors.full_name" class="invalid-feedback">{{ errors.full_name }}</div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Căn cước công dân</label>
                            <input 
                                v-model="residentForm.id_card_number" 
                                class="form-control shadow-sm" 
                                :class="{ 'is-invalid': errors.id_card_number }" 
                                placeholder="Nhập số CCCD (nếu có)" 
                            />
                            <div v-if="errors.id_card_number" class="invalid-feedback">{{ errors.id_card_number }}</div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Ngày sinh <span class="text-danger">*</span></label>
                            <input 
                                v-model="residentForm.date_of_birth" 
                                type="date" 
                                class="form-control shadow-sm" 
                                :class="{ 'is-invalid': errors.date_of_birth }" 
                                required 
                            />
                            <div v-if="errors.date_of_birth" class="invalid-feedback">{{ errors.date_of_birth }}</div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Giới tính</label>
                            <div class="d-flex gap-3">
                                <div class="form-check">
                                    <input 
                                        v-model="residentForm.gender" 
                                        class="form-check-input" 
                                        type="radio" 
                                        value="Nam" 
                                        id="genderMale" 
                                    />
                                    <label class="form-check-label" for="genderMale">Nam</label>
                                </div>
                                <div class="form-check">
                                    <input 
                                        v-model="residentForm.gender" 
                                        class="form-check-input" 
                                        type="radio" 
                                        value="Nữ" 
                                        id="genderFemale" 
                                    />
                                    <label class="form-check-label" for="genderFemale">Nữ</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Số điện thoại <span class="text-danger">*</span></label>
                            <input 
                                v-model="residentForm.phone_number" 
                                type="tel" 
                                class="form-control shadow-sm" 
                                :class="{ 'is-invalid': errors.phone_number }" 
                                placeholder="Nhập số điện thoại" 
                                required 
                            />
                            <div v-if="errors.phone_number" class="invalid-feedback">{{ errors.phone_number }}</div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Email <span class="text-danger">*</span></label>
                            <input 
                                v-model="residentForm.email" 
                                type="email" 
                                class="form-control shadow-sm" 
                                :class="{ 'is-invalid': errors.email }" 
                                placeholder="Nhập email" 
                                required 
                            />
                            <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                        </div>
                    </div>
                </fieldset>

                <!-- Thông tin căn hộ -->
                <fieldset class="mb-4">
                    <legend class="h5 fw-semibold text-dark mb-3">Thông tin căn hộ</legend>
                    <div v-if="errors.apartments" class="alert alert-danger mb-3">{{ errors.apartments }}</div>
                    <div v-for="(apartment, index) in apartments" :key="index" class="card mb-3 shadow-sm border-0" style="border-radius: 8px;">
                        <div class="card-header bg-light d-flex justify-content-between align-items-center">
                            <h6 class="mb-0 fw-semibold">Căn hộ {{ index + 1 }}</h6>
                            <button 
                                v-if="apartments.length > 1" 
                                @click.prevent="removeResident(index)" 
                                class="btn btn-sm btn-outline-danger" 
                                style="padding: 0.25rem 0.5rem;"
                            >
                                <Icon name="mdi:delete" size="16" /> Xóa
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label fw-medium">Mã căn hộ <span class="text-danger">*</span></label>
                                    <input 
                                        v-model="apartment.apartment_number" 
                                        type="text" 
                                        class="form-control shadow-sm" 
                                        placeholder="Nhập mã căn hộ" 
                                        required 
                                    />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-medium">Vai trò <span class="text-danger">*</span></label>
                                    <select v-model="apartment.role_in_apartment" class="form-select shadow-sm" required>
                                        <option value="0">Chủ hộ</option>
                                        <option value="1">Người thuê chính</option>
                                        <option value="2">Người thân</option>
                                    </select>
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
                    <button 
                        type="button" 
                        class="btn btn-outline-secondary" 
                        style="min-width: 120px;" 
                        @click="redirectToApartment"
                    >
                        Bỏ qua
                    </button>
                    <button 
                        type="submit" 
                        class="btn btn-primary" 
                        style="min-width: 120px;" 
                        :disabled="isSubmitting"
                    >
                        {{ isSubmitting ? 'Đang thêm...' : 'Thêm cư dân' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useResidentStore } from '@/stores/resident'
import { useToast } from 'vue-toastification';
import { useFormErrors } from '~/composables/useFormErrors'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const router = useRouter()
const useResident = useResidentStore()
const toast = useToast()
const { formatErrors } = useFormErrors()
const errors = ref({})
const isLoading = ref(false)

const residentForm = ref({
    full_name: '',
    id_card_number: '',
    date_of_birth: '',
    gender: 'Nam',
    phone_number: '',
    email: '',
    apartments: [],
})

const defaultApartment = () => ({
    apartment_number: '',
    role_in_apartment: 0,
})

const apartments = ref([defaultApartment()])
const isSubmitting = ref(false)

// Thêm một cư dân mới
const addResident = () => {
    apartments.value.push(defaultApartment())
}

// Xóa cư dân khỏi danh sách
const removeResident = (index) => {
    apartments.value.splice(index, 1)
}

const redirectToApartment = () => {
    router.push(`/resident`)
}

// Gửi dữ liệu lên API
const handleSubmit = async () => {
    const submissionData = {
        ...residentForm.value,
        apartments: apartments.value.filter(apt =>
            apt.apartment_number.trim() !== ''
        )
    }

    isLoading.value = true
    try {
        // Reset errors before making the API call
        errors.value = null;

        const result = await useResident.createResident(submissionData);
        if (result) {
            toast.success("Thêm cư dân thành công!", { timeout: 3000 });
            router.push(`/resident`);
        }
    } catch (error) {
        // Kiểm tra xem error có tồn tại và có thuộc tính errors không
        if (error && error.errors) {
            errors.value = formatErrors(error.errors);
        } else {
            // Xử lý các trường hợp lỗi khác
            errors.value = {
                general: error.message || "Đã có lỗi xảy ra khi thêm cư dân"
            };
        }

        toast.error("Thêm cư dân thất bại!", { timeout: 3000 });
    } finally {
        isLoading.value = false;
    }
}
</script>

<style scoped>
.form-label {
    font-size: 0.95rem;
    color: #495057;
}
.form-control, .form-select {
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
