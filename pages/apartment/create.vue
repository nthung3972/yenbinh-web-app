<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tạo căn hộ...</span>
        </div>
        <p>Đang tạo căn hộ...</p>
    </div>

    <div v-else>
        <div class="card shadow-sm p-3 m-3">
        <h5 class="fw-bold mb-3">Thêm căn hộ mới</h5>
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label class="form-label">Số căn hộ</label>
                <input type="text" v-model="apartment.apartment_number" class="form-control"
                    placeholder="Nhập số căn hộ" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Số tầng</label>
                <input type="number" v-model="apartment.floor_number" class="form-control" placeholder="Nhập số tầng"
                    required>
            </div>
            <div class="mb-3">
                <label class="form-label">Diện tích (m²)</label>
                <input type="number" v-model="apartment.area" class="form-control" placeholder="Nhập diện tích"
                    required>
            </div>
            <div class="mb-3">
                <label class="form-label">Loại căn hộ</label>
                <input type="text" v-model="apartment.ownership_type" class="form-control" placeholder="Nhập loại căn hộ"
                    required>
            </div>
            <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-success me-2">
                    <Icon name="material-symbols:save-rounded" size="20" class="me-1" />Thêm căn hộ
                </button>
                <NuxtLink to="/apartment" class="btn btn-secondary">
                    <Icon name="ic:round-cancel" size="20" class="me-1" />Bỏ qua
                </NuxtLink>
            </div>
        </form>
    </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApartmentStore } from '@/stores/apartment'
import { useToast } from 'vue-toastification';

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const apartmentStore = useApartmentStore()
const router = useRouter()
const toast = useToast()
const isLoading = ref(false)

const apartment = ref({
    apartment_number: '',
    floor_number: '',
    area: '',
    ownership_type: ''
})

const handleSubmit = async () => {
    isLoading.value = true
    try {
        const result = await apartmentStore.createApartment(apartment.value)
        if(result) {
            toast.success("Thêm căn hộ thành công!", { timeout: 3000 })
        }
    } catch (error) {
        toast.error("Thêm căn hộ thất bại!", { timeout: 3000 });
    }
    isLoading.value = false
}
</script>
