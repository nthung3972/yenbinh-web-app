<template>
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải thông tin cư dân...</span>
        </div>
        <p>Đang tải thông tin cư dân...</p>
    </div>

    <div v-else>
        <form @submit.prevent="updateResident">
            <div class="container mt-4">
                <h4>Chỉnh sửa thông tin cư dân</h4>
                <div class="card p-4 shadow-sm">
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
                                <input v-model="residentForm.date_of_birth" type="date" class="form-control" required />
                                <!-- <span v-if="errors.date_of_birth" class="error-message">
                                {{ errors.date_of_birth }}
                            </span> -->
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



                    <div class="card mt-4">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            Danh Sách Căn Hộ
                            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                                data-bs-target="#addApartmentModal">
                                <i class="bi bi-plus"></i> Thêm Căn Hộ
                            </button>
                        </div>
                        <div class="card-body table-apartments">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Mã Căn Hộ</th>
                                        <th>Địa Chỉ</th>
                                        <th>Diện Tích (m²)</th>
                                        <th>Loại căn hộ</th>
                                        <th>Ngày sở hữu</th>
                                        <th>Loại sở hữu</th>
                                        <th>Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(apartment, index) in residentForm.apartments" :key="index">
                                        <td>{{ apartment.apartment_number }}</td>
                                        <td>Tầng {{ apartment.floor_number }}</td>
                                        <td>{{ apartment.area }}</td>
                                        <td>{{ apartment.ownership_type }}</td>
                                        <td>{{ apartment.pivot.registration_date }}</td>
                                        <td>{{ apartment.pivot.role_in_apartment === 0 ? 'Chủ hộ' :
                                            (apartment.pivot.role_in_apartment === 1 ? 'Người thuê' : 'Người thân') }}
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal"
                                                data-bs-target="#deleteApartmentModal"
                                                @click="setSelectedApartment(apartment.apartment_id)">
                                                Rời căn hộ
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="mt-3 text-end d-flex">
                        <button style="min-width: 120px;" type="button" class="btn btn-secondary" @click="goBack">Bỏ
                            qua</button>
                        <button style="min-width: 120px;" type="submit" class="btn btn-primary me-2">
                            Lưu Thay Đổi
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <!-- Modal Thêm Căn Hộ -->

    <div class="modal fade" id="addApartmentModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="createApartment" novalidate>
                    <div class="modal-header">
                        <h5 class="modal-title">Thêm Căn Hộ Mới</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Tên căn hộ</label>
                            <input v-model="apartmentForm.apartment_number" type="text" class="form-control">
                            <span v-if="errors?.apartment_number" class="error-message">
                                {{ errors.apartment_number }}
                            </span>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Loại sở hữu</label>
                            <select v-model="apartmentForm.role_in_apartment" class="form-select"
                                placeholder="Nhập email" required>
                                <option :value="0">Chủ hộ</option>
                                <option :value="1">Người thuê chính</option>
                                <option :value="2">Người thân</option>
                            </select>
                            <span v-if="errors?.role_in_apartment" class="error-message">
                                {{ errors.role_in_apartment }}
                            </span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="submit" class="btn btn-primary">Thêm</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Xóa Căn Hộ -->
    <div class="modal fade" id="deleteApartmentModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="deleteApartment" novalidate>
                    <div class="modal-header">
                        <h5 class="modal-title">Xác Nhận Rời Căn Hộ</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Bạn có chắc chắn muốn rời căn hộ này không?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bỏ qua</button>
                        <button type="submit" class="btn btn-danger">Rời căn hộ</button>
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
const resident_id = route.params.id
const { formatErrors } = useFormErrors()
const errors = ref({})
const toast = useToast()
const isLoading = computed(() => useResident.isLoading);

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

const apartmentForm = ref({
    apartment_number: '',
    role_in_apartment: 0,
})

const leaveForm = ref({
    resident_id: '',
    apartment_id: '',
})

const goBack = () => {
    router.back();
}

const setSelectedApartment = (id) => {
    leaveForm.value.apartment_id = id;
    leaveForm.value.resident_id = parseInt(resident_id)
};

const updateResident = async () => {
    try {
        await useResident.updateResident(residentForm.value, resident_id)
        toast.success("Cập nhật thông tin cư dân thành công!");
    } catch (error) {
        toast.error("Cập nhật thông tin cư dân thất bại!");
    }
}

const deleteApartment = async () => {
    try {
        await useResident.deleteResidentToApartment(leaveForm.value, resident_id);
        toast.success("Rời căn hộ thành công!");
        await useResident.fetchResident(resident_id);
        residentForm.value = { ...useResident.resident };
    } catch (error) {
        toast.error("Lỗi khi rời căn hộ!");
    }
}

const createApartment = async () => {
    const data = { ...apartmentForm.value, resident_id };
    try {
        errors.value = null;

        const result = await useResident.addResidentToApartment(data, resident_id);
        if (result) {
            toast.success("Thêm căn hộ thành công!", { timeout: 3000 });
            await useResident.fetchResident(resident_id);
            residentForm.value = { ...useResident.resident };
        }
    } catch (error) {
        if (error && error.errors) {
            errors.value = formatErrors(error.errors);
            console.log('errors.value', errors.value);
        } else {
            errors.value = {
                general: error.message || "Đã có lỗi xảy ra khi thêm cư dân"
            };
        }
        toast.error("Thêm căn hộ thất bại!", { timeout: 3000 });
    } finally {

    }
};

onMounted(async () => {
    await useResident.fetchResident(resident_id);
    residentForm.value = { ...useResident.resident };
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
