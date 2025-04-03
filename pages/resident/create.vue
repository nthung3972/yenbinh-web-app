<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tạo căn hộ...</span>
        </div>
        <p>Đang tạo căn hộ...</p>
    </div>

    <div v-else>
        <div class="create-container mt-4" style="width: 100%;">
            <h4>Thêm cư dân vào căn hộ</h4>
            <div class="card p-4 shadow-sm">
                <form @submit.prevent="handleSubmit">
                    <h3 class="h5 mb-3">Thông tin cư dân</h3>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Họ và tên</label>
                                <input v-model="residentForm.full_name" type="text" class="form-control"
                                    :class="{ 'error-input': errors.full_name }" required />
                                <span v-if="errors.full_name" class="error-message">
                                    {{ errors.full_name }}
                                </span>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="form-label">Căn cước công dân</label>
                                <input v-model="residentForm.id_card_number" class="form-control"
                                    :class="{ 'error-input': errors.id_card_number }"
                                    placeholder="Số căn cước (nếu có)" />
                                <span v-if="errors.id_card_number" class="error-message">
                                    {{ errors.id_card_number }}
                                </span>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Ngày sinh</label>
                                <input v-model="residentForm.date_of_birth" type="date" class="form-control"
                                    :class="{ 'error-input': errors.date_of_birth }" required />
                                <span v-if="errors.date_of_birth" class="error-message">
                                    {{ errors.date_of_birth }}
                                </span>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="form-label">Giới tính</label>
                                <div class="d-flex" style="justify-content: unset;">
                                    <div class="form-check me-3">
                                        <input v-model="residentForm.gender" class="form-check-input" type="radio"
                                            value="Nam" id="genderMale" />
                                        <label class="form-check-label" for="genderMale">Nam</label>
                                    </div>
                                    <div class="form-check">
                                        <input v-model="residentForm.gender" class="form-check-input" type="radio"
                                            value="Nữ" id="genderFemale" />
                                        <label class="form-check-label" for="genderFemale">Nữ</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Số điện thoại</label>
                                <input v-model="residentForm.phone_number" type="tel" class="form-control"
                                    :class="{ 'error-input': errors.phone_number }" placeholder="Nhập số điện thoại"
                                    required />
                                <span v-if="errors.phone_number" class="error-message">
                                    {{ errors.phone_number }}
                                </span>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="form-label">Email</label>
                                <input v-model="residentForm.email" type="email" class="form-control"
                                    :class="{ 'error-input': errors.email }" placeholder="Nhập email" required />
                                <span v-if="errors.email" class="error-message">
                                    {{ errors.email }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <h3 class="h5 mb-3">Thông tin căn hộ</h3>
                    <span v-if="errors.apartments" class="error-message">
                        {{ errors.apartments }}
                    </span>
                    <div v-for="(apartment, index) in apartments" :key="index" class="card mb-3">
                        <h5 style="margin: 5px 0 0 10px;">Căn hộ {{ index + 1 }}</h5>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Số căn hộ</label>
                                    <input v-model="apartment.apartment_number" type="text" class="form-control"
                                        required />

                                </div>

                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Vai trò trong căn hộ</label>
                                    <select v-model="apartment.role_in_apartment" class="form-select"
                                        placeholder="Nhập email" required>
                                        <option value="0">Chủ hộ</option>
                                        <option value="1">Người thuê chính</option>
                                        <option value="2">Người thân</option>
                                    </select>
                                </div>
                                <div class="d-flex justify-content-end">
                                    <div v-if="apartments.length > 1">
                                        <button @click.prevent="removeResident(index)" class="btn btn-danger">
                                            Xóa căn hộ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="button" class="btn btn-success mb-3" @click="addResident">
                        + Thêm căn hộ
                    </button>

                    <div class="mb-3 d-flex">
                        <button style="min-width: 120px;" type="button" class="btn btn-secondary"
                            @click="redirectToApartment">Bỏ
                            qua</button>
                        <button style="min-width: 120px;" type="submit" class="btn btn-primary me-2"
                            :disabled="isSubmitting">
                            {{ isSubmitting ? 'Đang thêm...' : 'Thêm cư dân' }}
                        </button>
                    </div>
                </form>
            </div>
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
.d-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

.error-message {
    color: red;
    font-size: 1em;
    margin-top: 5px;
}

.create-container {
    max-width: 1140px;
    margin: 0 auto;
}
</style>
