<template>
    <div class="container mt-4">
        <h4>Thêm cư dân vào căn hộ #{{ apartmentId }}</h4>
        <div class="card p-4 shadow-sm">
            <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label class="form-label">Họ và tên</label>
                    <input v-model="resident.full_name" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Ngày sinh</label>
                    <input v-model="resident.date_of_birth" type="date" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Số điện thoại</label>
                    <input v-model="resident.phone_number" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input v-model="resident.email" type="email" class="form-control" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Ngày đăng ký</label>
                    <input v-model="resident.registration_date" type="date" class="form-control" required />
                </div>
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Đang thêm...' : 'Thêm cư dân' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const route = useRoute()
const router = useRouter()
const apartmentId = route.params.id

const resident = ref({
  full_name: '',
  date_of_birth: '',
  phone_number: '',
  email: '',
  registration_date: ''
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
    console.log('resident'  , resident.value);
//   isSubmitting.value = true
//   try {
//     const response = await axios.post('http://localhost:8000/api/residents', {
//       ...resident.value,
//       apartment_id: apartmentId
//     })
//     toast.success('Thêm cư dân thành công!')
//     router.push('/apartment') // Hoặc redirect về danh sách căn hộ hoặc resident tuỳ ý
//   } catch (error) {
//     console.error(error)
//     toast.error('Có lỗi xảy ra khi thêm cư dân')
//   } finally {
//     isSubmitting.value = false
//   }
}
</script>