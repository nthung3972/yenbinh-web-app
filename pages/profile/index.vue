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
            <h4 class="fw-bold text-primary mb-4">Chỉnh sửa thông tin cá nhân</h4>
            <form @submit.prevent="saveProfile">
                <div class="d-flex flex-column flex-md-row gap-4">
                    <!-- Avatar Section -->
                    <fieldset class="border p-3 rounded flex-fill" style="min-width: 0;">
                        <legend class="float-none w-auto px-2 fs-6 fw-semibold text-dark">Ảnh đại diện</legend>
                        <div class="text-center d-flex flex-column justify-content-between h-100">
                            <div>
                                <img :src="previewAvatar || profileForm.avatar || defaultAvatar"
                                    class="rounded-circle img-fluid avatar-image mb-3" alt="Avatar"
                                    style="width: 150px; height: 150px; object-fit: cover;" />
                            </div>
                            <div>
                                <input type="file" class="form-control shadow-sm" accept="image/*"
                                    @change="handleAvatarChange" ref="avatarInput" />
                                <small v-if="errors?.avatar" class="text-danger d-block mt-1">{{ errors?.avatar[0] }}</small>
                            </div>
                        </div>
                    </fieldset>

                    <!-- Thông tin cá nhân -->
                    <fieldset class="border p-3 rounded flex-fill" style="min-width: 0;">
                        <legend class="float-none w-auto px-2 fs-6 fw-semibold text-dark">Thông tin cá nhân</legend>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-medium">Tên <span class="text-danger">*</span></label>
                                <input v-model="profileForm.name" type="text" class="form-control shadow-sm"
                                    :class="{ 'is-invalid': errors.name }" placeholder="Nhập tên của bạn" />
                                <div v-if="errors.name" class="invalid-feedback">{{ errors.name[0] }}</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-medium">Số điện thoại <span
                                        class="text-danger">*</span></label>
                                <input v-model="profileForm.phone_number" type="tel" class="form-control shadow-sm"
                                    :class="{ 'is-invalid': errors.phone_number }" placeholder="Nhập số điện thoại"
                            />
                                <div v-if="errors.phone_number" class="invalid-feedback">{{ errors.phone_number[0] }}</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-medium">Ngày sinh <span class="text-danger">*</span></label>
                                <input v-model="profileForm.date_of_birth" type="date" class="form-control shadow-sm"
                                    :class="{ 'is-invalid': errors.date_of_birth }" />
                                <div v-if="errors.date_of_birth" class="invalid-feedback">{{ errors.date_of_birth[0] }}
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-medium">Giới tính <span class="text-danger">*</span></label>
                                <select v-model="profileForm.gender" class="form-select shadow-sm"
                                    :class="{ 'is-invalid': errors.gender }">
                                    <option value="">Chọn giới tính</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                                <div v-if="errors.gender" class="invalid-feedback">{{ errors.gender[0] }}</div>
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-medium">Địa chỉ <span class="text-danger">*</span></label>
                                <input v-model="profileForm.address" type="text" class="form-control shadow-sm"
                                    :class="{ 'is-invalid': errors.address }" placeholder="Nhập địa chỉ" />
                                <div v-if="errors.address" class="invalid-feedback">{{ errors.address[0] }}</div>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" class="btn btn-outline-secondary" style="min-width: 120px;"
                        @click="cancelEdit">
                        Hủy
                    </button>
                    <button type="submit" class="btn btn-primary" style="min-width: 120px;" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Đang lưu...' : 'Lưu' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useUploadStore } from '@/stores/upload'
import defaultAvatar from '@/assets/images/avatar-default.jpg'
import { useToast } from 'vue-toastification'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const userStore = useUserStore()
const uploadStore = useUploadStore()
const toast = useToast()
const isLoading = computed(() => userStore.isLoading)
const errors = ref({})
const router = useRouter()


const isSubmitting = ref(false)
const previewAvatar = ref(null)
const avatarInput = ref(null)
const profileForm = ref({
    name: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    address: '',
    avatar: ''
});

const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        previewAvatar.value = URL.createObjectURL(file);

        const formData = new FormData();

        formData.append('image', file); 
        formData.append('folder', 'users'); 
        if (profileForm.value.avatar) {
            formData.append('old_path', profileForm.value.avatar);
        }

        try {
            const result = await uploadStore.uploadImage(formData)
            if(result) {
                console.log('result.path:', result.path)
                profileForm.value.avatar = result.path
                userStore.setAvatar(result.path)
            }
        } catch (error) {
            console.log('error:', error)
            errors.value = error.errors;
            toast.error('Đã xảy ra lỗi khi cập nhật ảnh đại diện!')
        }
    }
};

const saveProfile = async () => {
    isSubmitting.value = true;
    errors.value = {};
    try {
        console.log(profileForm.value)
        await userStore.updateUerInfo(profileForm.value)
        toast.success('Lưu thông tin thành công!')
    } catch (error) {
        errors.value = error.errors;
        toast.error('Có lỗi xảy ra khi lưu thông tin!')
    } finally {
        isSubmitting.value = false;
    }
};

const cancelEdit = () => {
    router.back();
};

const loadProfileInfo = async () => {
    const result = await userStore.getUserInfo()
    if (result) {
        profileForm.value = result.user
    }
}

onMounted(() => {
    loadProfileInfo()
});
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

.avatar-image {
    border: 1px solid #e9ecef;
}

.btn {
    border-radius: 8px;
    padding: 0.5rem 1rem;
    transition: all 0.2s ease;
}

.btn:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

fieldset {
    background-color: #f8f9fa;
}

legend {
    background-color: #fff;
}
</style>