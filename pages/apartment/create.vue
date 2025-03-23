<template>
    <!-- Sau khi submit thành công sẽ show modal -->
    <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true"
        ref="modalRef">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="successModalLabel">Tạo căn hộ thành công!</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
                </div>
                <div class="modal-body">
                    Bạn có muốn thêm cư dân vào căn hộ này ngay bây giờ không?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Không</button>
                    <button type="button" class="btn btn-success" @click="redirectToAddResident">Có</button>
                </div>
            </div>
        </div>
    </div>

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
                <label class="form-label">Tình trạng căn hộ</label>
                <select v-model="apartment.status" class="form-select" required>
                    <option value="1">Để trống</option>
                </select>
            </div>
            <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-success me-2">
                    <Icon name="material-symbols:save-rounded" size="20" class="me-1" />Lưu
                </button>
                <NuxtLink to="/apartment" class="btn btn-secondary">
                    <Icon name="ic:round-cancel" size="20" class="me-1" />Hủy
                </NuxtLink>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApartmentStore } from '@/stores/apartment'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const apartmentStore = useApartmentStore()
const router = useRouter()
const modalRef = ref(null)
let modalInstance = null
const createdApartmentId = ref()

const apartment = ref({
    apartment_number: '',
    floor_number: '',
    area: '',
    status: '1'
})

onMounted(() => {
    modalInstance = new bootstrap.Modal(modalRef.value)
})

const handleSubmit = async () => {
    try {
        const result = await apartmentStore.createApartment(apartment.value)
        createdApartmentId.value = result.data.data.apartment_id
        modalInstance.show()
    } catch (error) {
        console.error(error)
    }
}

const redirectToAddResident = () => {
      modalInstance.hide()
      router.push(`/apartment/${createdApartmentId.value}/add-resident`)
}

</script>