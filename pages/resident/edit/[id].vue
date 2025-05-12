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
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="fw-bold text-primary">
                        <Icon name="mdi:receipt-text" size="24" class="me-2" />
                        Chỉnh sửa thông tin cư dân
                    </h4>
                    <button type="button" class="btn btn-secondary" @click="goBack">
                        <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                        Quay lại
                    </button>
                </div>
                <div class="card p-4 shadow-sm">
                    <h3 class="h5 mb-3">Thông tin cư dân</h3>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Họ và tên</label>
                                <input v-model="residentForm.full_name" type="text" class="form-control" required
                                    @input="onChange()" />
                                <small v-if="errors?.full_name" class="error-message">
                                    {{ errors.full_name[0] }}
                                </small>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="form-label">Căn cước công dân</label>
                                <input v-model="residentForm.id_card_number" class="form-control" @input="onChange()"
                                    required placeholder="Số căn cước (nếu có)" />
                                <small v-if="errors?.id_card_number" class="error-message">
                                    {{ errors.id_card_number[0] }}
                                </small>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Ngày sinh</label>
                                <input v-model="residentForm.date_of_birth" type="date" class="form-control" required
                                    @input="onChange()" />
                                <small v-if="errors?.date_of_birth" class="error-message">
                                    {{ errors.date_of_birth[0] }}
                                </small>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="form-label">Giới tính</label>
                                <div class="d-flex" style="justify-content: unset;">
                                    <div class="form-check me-3">
                                        <input v-model="residentForm.gender" class="form-check-input" type="radio"
                                            @input="onChange()" value="Nam" id="genderMale" />
                                        <label class="form-check-label" for="genderMale">Nam</label>
                                    </div>
                                    <div class="form-check">
                                        <input v-model="residentForm.gender" class="form-check-input" type="radio"
                                            @input="onChange()" value="Nữ" id="genderFemale" />
                                        <label class="form-check-label" for="genderFemale">Nữ</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Số điện thoại</label>
                                <input v-model="residentForm.phone_number" type="tel" class="form-control" required
                                    @input="onChange()" placeholder="Nhập số điện thoại" />
                                <small v-if="errors?.phone_number" class="error-message">
                                    {{ errors.phone_number[0] }}
                                </small>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="form-label">Email</label>
                                <input v-model="residentForm.email" type="email" class="form-control" required
                                    @input="onChange()" placeholder="Nhập email" />
                                <small v-if="errors?.email" class="error-message">
                                    {{ errors.email[0] }}
                                </small>
                            </div>
                        </div>
                    </div>

                    <div class="card mt-4">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            Danh Sách Căn Hộ
                            <button type="button" class="btn btn-success btn-sm" @click="openAddModal()">
                                <Icon name="ic:baseline-add-circle-outline" size="16" class="me-1" /> Thêm Căn Hộ
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
                                    <tr v-for="(apartment, index) in residentForm.current_apartments" :key="index">
                                        <td>{{ apartment.apartment_number }}</td>
                                        <td>Tầng {{ apartment.floor_number }}</td>
                                        <td>{{ apartment.area }}</td>
                                        <td>{{ apartment.ownership_type }}</td>
                                        <td>{{ apartment.pivot.registration_date }}</td>
                                        <td>{{ apartment.pivot.role_in_apartment === 0 ? 'Chủ hộ' :
                                            (apartment.pivot.role_in_apartment === 1 ? 'Người thuê' : 'Người thân') }}
                                        </td>
                                        <td>
                                            <button type="button" class="btn btn-danger btn-sm"
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
                        <button style="min-width: 120px;" type="button" class="btn btn-secondary" @click="reset()">Làm
                            mới</button>
                        <button style="min-width: 120px;" type="submit" class="btn btn-primary me-2">
                            Lưu Thay Đổi
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <ConfirmModal v-model="showDeleteModal" title="Xác nhận xóa căn hộ"
        :message="`Bạn có chắc chắn muốn xóa căn hộ này không?`" confirmText="Xóa" @confirm="deleteApartment" />

    <<AddApartmentModal v-model="showAddModal" :errors="formErrors" @submit="createApartment"/>

    <ConfirmNavigationModal v-model="showConfirmModal" @confirm="confirmNavigation" @cancel="cancelNavigation" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useResidentStore } from '@/stores/resident';
import { useToast } from 'vue-toastification';
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import AddApartmentModal from '@/components/modal/AddResidentToApartmentModal.vue'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const useResident = useResidentStore()
const route = useRoute()
const router = useRouter()
const resident_id = route.params.id
const errors = ref({})
const toast = useToast()
const isLoading = computed(() => useResident.isLoading)
const showDeleteModal = ref(false)
const showAddModal = ref(false)
const formErrors = ref({})

const residentForm = ref({
    full_name: '',
    id_card_number: '',
    date_of_birth: '',
    gender: 'Nam',
    phone_number: '',
    email: '',
    created_at: '',
    current_apartments: []
});

const leaveForm = ref({
    resident_id: '',
    apartment_id: '',
})

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

const reset = () => {
    residentForm.value.full_name = ''
    residentForm.value.id_card_number = ''
    residentForm.value.date_of_birth = ''
    residentForm.value.gender = 'Nam'
    residentForm.value.phone_number = ''
    residentForm.value.email = ''
    setEditing(true)
}

const setSelectedApartment = (id) => {
    leaveForm.value.apartment_id = id;
    leaveForm.value.resident_id = parseInt(resident_id)
    showDeleteModal.value = true
}

const openAddModal = () => {
    showAddModal.value = true
}

const loadResident = async () => {
    console.log(resident_id);
    await useResident.fetchResident(resident_id);
    residentForm.value = { ...useResident.resident };
    console.log(residentForm.value);
}

const updateResident = async () => {
    try {
        await useResident.updateResident(residentForm.value, resident_id)
        setEditing(false)
        toast.success("Cập nhật thông tin cư dân thành công!");
    } catch (error) {
        errors.value = error.errors
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
        if (error) {
            toast.error("Lỗi khi rời căn hộ!");
        }
    }
}

const createApartment = async (formData) => {
    const data = { ...formData, resident_id }
    try {
        errors.value = {}
        formErrors.value = {}

        const result = await useResident.addResidentToApartment(data, resident_id);
        if (result) {
            toast.success("Thêm căn hộ thành công!", { timeout: 3000 });
            formErrors.value = null
            await useResident.fetchResident(resident_id);
            residentForm.value = { ...useResident.resident };
            showAddModal.value = false
        }
    } catch (error) {
        if (error && error.errors) {
            formErrors.value.apartment_number  = error.errors.apartment_number
            formErrors.value.role_in_apartment  = error.errors.role_in_apartment
        } else {
            errors.value = {
                general: error.message || "Đã có lỗi xảy ra khi thêm cư dân"
            };
        }
        toast.error("Thêm căn hộ thất bại!", { timeout: 3000 });
    } finally {

    }
};

onMounted(() => {
    loadResident()
    setupRouteGuard()
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
