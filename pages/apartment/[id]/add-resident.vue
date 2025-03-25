<template>
    <div class="container mt-4">
        <h4>Thêm cư dân vào căn hộ</h4>
        <div class="card p-4 shadow-sm">
            <form @submit.prevent="handleSubmit">

                <div v-if="generalError" class="alert alert-danger mb-3">
                    {{ generalError }}
                </div>

                <div v-if="Object.keys(generalValidationErrors).length > 0" class="alert alert-danger mb-3">
                    <ul class="mb-0">
                        <li v-for="(errorMessages, field) in generalValidationErrors" :key="field">
                            {{ errorMessages[0] }}
                        </li>
                    </ul>
                </div>

                <h3 class="h5 mb-3">Thông tin cư dân</h3>

                <div v-for="(resident, index) in residents" :key="index" class="card mb-3">
                    <h5>Cư dân {{ index + 1 }}</h5>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Họ và tên</label>
                                <input v-model="resident.full_name" type="text" class="form-control"
                                    :class="{ 'is-invalid': getFieldError(index, 'full_name') }" required />
                                <div class="invalid-feedback" v-if="getFieldError(index, 'full_name')">
                                    {{ getFieldError(index, 'full_name') }}
                                </div>
                            </div>


                            <div class="col-md-6 mb-3">
                                <label class="form-label">Căn cước công dân</label>
                                <input v-model="resident.id_card_number" class="form-control"
                                    :class="{ 'is-invalid': getFieldError(index, 'id_card_number') }"
                                    placeholder="Số căn cước (nếu có)" />
                                <div class="invalid-feedback" v-if="getFieldError(index, 'id_card_number')">
                                    {{ getFieldError(index, 'id_card_number') }}
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Ngày sinh</label>
                                <input v-model="resident.date_of_birth" type="date" class="form-control"
                                    :class="{ 'is-invalid': getFieldError(index, 'date_of_birth') }" required />
                                <div class="invalid-feedback" v-if="getFieldError(index, 'date_of_birth')">
                                    {{ getFieldError(index, 'date_of_birth') }}
                                </div>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="form-label">Giới tính</label>
                                <div class="d-flex">
                                    <div class="form-check me-3">
                                        <input v-model="resident.gender" class="form-check-input" type="radio"
                                            value="Nam" id="genderMale" />
                                        <label class="form-check-label" for="genderMale">Nam</label>
                                    </div>
                                    <div class="form-check">
                                        <input v-model="resident.gender" class="form-check-input" type="radio"
                                            value="Nữ" id="genderFemale" />
                                        <label class="form-check-label" for="genderFemale">Nữ</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Số điện thoại</label>
                                <input v-model="resident.phone_number" type="tel" class="form-control"
                                    :class="{ 'is-invalid': getFieldError(index, 'phone_number') }"
                                    placeholder="Nhập số điện thoại" required />
                                <div class="invalid-feedback" v-if="getFieldError(index, 'phone_number')">
                                    {{ getFieldError(index, 'phone_number') }}
                                </div>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="form-label">Email</label>
                                <input v-model="resident.email" type="email" class="form-control"
                                    :class="{ 'is-invalid': getFieldError(index, 'email') }" placeholder="Nhập email"
                                    required />
                                <div class="invalid-feedback" v-if="getFieldError(index, 'email')">
                                    {{ getFieldError(index, 'email') }}
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Ngày chuyển vào</label>
                                <input v-model="resident.move_in_date" type="date" class="form-control"
                                    :class="{ 'is-invalid': getFieldError(index, 'move_in_date') }"
                                    placeholder="Nhập email" required />
                                <div class="invalid-feedback" v-if="getFieldError(index, 'move_in_date')">
                                    {{ getFieldError(index, 'move_in_date') }}
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Ngày chuyển đi (Nếu có)</label>
                                <input v-model="resident.move_out_date" type="date"
                                    :class="{ 'is-invalid': getFieldError(index, 'move_out_date') }"
                                    placeholder="Nhập email" class="form-control" />
                                <div class="invalid-feedback" v-if="getFieldError(index, 'move_out_date')">
                                    {{ getFieldError(index, 'move_out_date') }}
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Loại cư dân</label>
                                <select v-model="resident.resident_type" class="form-select"
                                    :class="{ 'is-invalid': getFieldError(index, 'resident_type') }"
                                    placeholder="Nhập email" required>
                                    <option value="0">Chủ hộ</option>
                                    <option value="1">Người thuê chính</option>
                                    <option value="2">Người thân</option>
                                </select>
                                <div class="invalid-feedback" v-if="getFieldError(index, 'resident_type')">
                                    {{ getFieldError(index, 'resident_type') }}
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Ngày đăng ký</label>
                                <input v-model="resident.registration_date" type="date" class="form-control"
                                    :class="{ 'is-invalid': getFieldError(index, 'registration_date') }" required />
                                <div class="invalid-feedback" v-if="getFieldError(index, 'registration_date')">
                                    {{ getFieldError(index, 'registration_date') }}
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Trạng thái</label>
                            <select v-model="resident.registration_status" class="form-select"
                                :class="{ 'is-invalid': getFieldError(index, 'registration_status') }" required>
                                <option value="0">Đang cư trú</option>
                            </select>
                            <div class="invalid-feedback" v-if="getFieldError(index, 'registration_status')">
                                {{ getFieldError(index, 'registration_status') }}
                            </div>
                        </div>

                        <div class="d-flex justify-content-end">
                            <button @click.prevent="removeResident(index)" class="btn btn-danger">
                                Xóa cư dân
                            </button>
                        </div>
                    </div>
                </div>

                <button type="button" class="btn btn-success mb-3" @click="addResident">
                    + Thêm cư dân mới
                </button>
                <div class="mb-3 d-flex">
                    <button style="min-width: 120px;" type="submit" class="btn btn-primary me-2"
                        :disabled="isSubmitting">
                        {{ isSubmitting ? 'Đang thêm...' : 'Thêm cư dân' }}
                    </button>
                    <button style="min-width: 120px;" type="button" class="btn btn-secondary"
                        @click="redirectToApartment">Bỏ
                        qua</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApartmentStore } from '@/stores/apartment'
import { nextTick } from 'vue'
import { useToast } from 'vue-toastification';

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const route = useRoute()
const router = useRouter()
const apartmentId = route.params.id
const apartmentStore = useApartmentStore()
const toast = useToast();


const defaultResident = () => ({
    full_name: '',
    id_card_number: '',
    date_of_birth: '',
    gender: 'Nam',
    phone_number: '',
    email: '',
    move_in_date: '',
    move_out_date: '',
    resident_type: 0,
    registration_date: '',
    registration_status: 0
})

const residents = ref([defaultResident()])
const isSubmitting = ref(false)
const validationErrors = ref({}) 
const generalError = ref('') 
const generalValidationErrors = ref({});

// Hàm lấy lỗi cho một trường cụ thể
const getFieldError = (index, fieldName) => {
    const errorKey = `${index}.${fieldName}`;
    return validationErrors.value[errorKey] ? validationErrors.value[errorKey][0] : null;
}

// Thêm một cư dân mới
const addResident = () => {
    residents.value.push(defaultResident())
}

// Xóa cư dân khỏi danh sách
const removeResident = (index) => {
    residents.value.splice(index, 1)

    // Cập nhật lại các lỗi sau khi xóa cư dân
    const newErrors = {};

    Object.keys(validationErrors.value).forEach(key => {
        // Phân tích key để lấy index và fieldName
        const parts = key.split('.');
        const oldIndex = parseInt(parts[0]);
        const field = parts[1];

        if (oldIndex < index) {
            // Không thay đổi nếu index nhỏ hơn index bị xóa
            newErrors[key] = validationErrors.value[key];
        } else if (oldIndex > index) {
            // Giảm index đi 1 nếu index lớn hơn index bị xóa
            const newKey = `${oldIndex - 1}.${field}`;
            newErrors[newKey] = validationErrors.value[key];
        }
    });

    validationErrors.value = newErrors;
}

const redirectToApartment = () => {
    router.push(`/apartment`)
}

// Làm trống thông báo lỗi
const clearErrors = () => {
    validationErrors.value = {}
    generalValidationErrors.value = {}
    generalError.value = ''
}

const scrollToFirstError = () => {
    nextTick(() => {
        // Ưu tiên cuộn đến lỗi chung nếu có
        const generalErrorElement = document.querySelector('.alert-danger');
        if (generalErrorElement) {
            generalErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Nếu không có lỗi chung, cuộn đến lỗi của input
        const errorElement = document.querySelector('.is-invalid');
        if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
};

// Gửi dữ liệu lên API
const handleSubmit = async () => {
    clearErrors() // Xóa lỗi cũ trước khi submit
    generalValidationErrors.value = {};

    const residentsData = residents.value.map(resident => ({
        ...resident,
        apartment_id: apartmentId // Thêm apartment_id vào mỗi object cư dân
    }))

    isSubmitting.value = true
    try {
        const result = await apartmentStore.createMultipleResidents(residentsData, apartmentId)
        if (result) {
            toast.success("Thêm cư dân thành công!", { timeout: 3000 });
            // Nếu thành công, chuyển trang
            router.push('/apartment')
        }
    } catch (error) {
        console.error('Error data:', error)

        if (error) {
            const responseData = error

            // Kiểm tra định dạng lỗi
            if (responseData.message) {
                // Nếu có thông báo chung
                generalError.value = responseData.message
            }

            // Xử lý đúng cấu trúc lỗi thực tế
            if (responseData.errors && typeof responseData.errors === 'object') {
                // validationErrors.value = responseData.errors
                // Tách lỗi chung và lỗi cụ thể cho từng cư dân
                Object.keys(responseData.errors).forEach(key => {
                    if (key.startsWith('general.')) {
                        // Lỗi chung (không theo index)
                        const fieldName = key.split('.')[1];
                        generalValidationErrors.value[fieldName] = responseData.errors[key];
                    } else {
                        // Lỗi theo index cho từng cư dân
                        validationErrors.value[key] = responseData.errors[key];
                    }
                });

                // Gọi hàm cuộn sau khi cập nhật lỗi
                scrollToFirstError();
            }
        } else {
            generalError.value = 'Có lỗi xảy ra khi kết nối đến máy chủ.';
            scrollToFirstError(); // Cuộn nếu có lỗi chung
        }
    } finally {
        isSubmitting.value = false
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
</style>
