<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tạo căn hộ...</span>
        </div>
        <p>Đang tạo căn hộ...</p>
    </div>
    
    <div v-else>
        <div class="container mt-4">
        <h4>Chỉnh sửa thông tin cư dân</h4>
        <div class="card p-4 shadow-sm">
            <form @submit.prevent="handleSubmit">

                <h3 class="h5 mb-3">Thông tin cư dân</h3>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Họ và tên</label>
                            <input v-model="residentForm.full_name" type="text" class="form-control" required />
                            <!-- <span v-if="errors.full_name" class="error-message">
                                {{ errors.full_name }}
                            </span> -->
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="form-label">Căn cước công dân</label>
                            <input v-model="residentForm.id_card_number" class="form-control"
                                placeholder="Số căn cước (nếu có)" />
                            <!-- <span v-if="errors.id_card_number" class="error-message">
                                {{ errors.id_card_number }}
                            </span> -->
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Ngày sinh</label>
                            <input v-model="residentForm.date_of_birth" type="date" class="form-control"  required />
                            <!-- <span v-if="errors.date_of_birth" class="error-message">
                                {{ errors.date_of_birth }}
                            </span> -->
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="form-label">Giới tính</label>
                            <div class="d-flex">
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
                                placeholder="Nhập số điện thoại" required />
                            <!-- <span v-if="errors.phone_number" class="error-message">
                                {{ errors.phone_number }}
                            </span> -->
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="form-label">Email</label>
                            <input v-model="residentForm.email" type="email" class="form-control" 
                                placeholder="Nhập email" required />
                            <!-- <span v-if="errors.email" class="error-message">
                                {{ errors.email }}
                            </span> -->
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <!-- <label class="form-label">Ngày đăng ký</label>
                            <input v-model="residentForm.created_at" type="date" class="form-control" required /> -->
                            <!-- <span v-if="errors.registration_date" class="error-message">
                                {{ errors.registration_date }}
                            </span> -->
                        </div>
                    </div>
                </div>

                <h3 class="h5 mb-3">Thông tin căn hộ đang ở</h3>
                <!-- <span v-if="errors.apartments" class="error-message">
                    {{ errors.apartments }}
                </span> -->
                <div v-for="(apartment, index) in residentForm.apartments" :key="index" class="card mb-3">
                    <h5 style="margin: 5px 0 0 10px;">Căn hộ #{{ apartment.apartment_number }}</h5>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Số căn hộ</label>
                                <input v-model="apartment.apartment_number" type="text" class="form-control" readonly required /> 
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="form-label">Vai trò trong căn hộ</label>
                                <select v-model="apartment.pivot.role_in_apartment" class="form-select"
                                    placeholder="Nhập email" required>
                                    <option :value="0">Chủ hộ</option>
                                    <option :value="1">Người thuê chính</option>
                                    <option :value="2">Người thân</option>
                                </select>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="form-label">Tình trạng cư trú</label>
                                <select v-model="apartment.pivot.registration_status" class="form-select"
                                    placeholder="Nhập email" required>
                                    <option :value="0">Đang cư trú</option>
                                    <option :value="1">Đã rời đi</option>
                                </select>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="form-label">Ngày đăng ký</label>
                                <input v-model="apartment.pivot.registration_date" type="date" class="form-control" readonly required />
                            </div>

                            <div class="d-flex justify-content-end">
                                <!-- <div v-if="apartments.length > 1"> -->
                                    <button @click.prevent="removeResident(index)" class="btn btn-danger">
                                        Xóa căn hộ
                                    </button>
                                <!-- </div> -->
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" class="btn btn-success mb-3" @click="addResident">
                    + Thêm căn hộ
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
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useResidentStore } from '@/stores/resident';
import { useToast } from 'vue-toastification';

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})


const useResident = useResidentStore();
const route = useRoute()
const router = useRouter()
const residentId = route.params.id
const isLoading = ref(false);

const residentForm = ref({
    full_name: '',
    id_card_number: '',
    date_of_birth: '',
    gender: 'Nam',
    phone_number: '',
    email: '',
    created_at: '',
    apartments: []
});

const redirectToApartment = () => {
    router.push('/resident')
}

onMounted(async () => {
    isLoading.value = true;
    await useResident.fetchResident(residentId);
    console.log(useResident.resident)
    residentForm.value = { ...useResident.resident };
    isLoading.value = false;
})
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
</style>
