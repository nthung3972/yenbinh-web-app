<template>
    <!-- Hiển thị loading khi đang tải -->
    <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else class="container form-container animate-fade">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-bold text-primary">
                <Icon name="mdi:receipt-text" size="24" class="me-2" />
                Sửa thông tin căn hộ
            </h4>
            <button class="btn btn-secondary" @click="goBack">
                <Icon name="mdi:arrow-left-circle" size="20" class="me-2" />
                Quay lại
            </button>
        </div>
        <div class="card">
            <div class="card-body">
                <form @submit.prevent="updateApartment">
                    <div class="form-section">
                        <h5 class="section-title"><i class="fas fa-info-circle me-2"></i>Thông tin căn
                            hộ</h5>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="form-label-group">
                                    <input v-model="apartmentForm.apartment_number" type="text" class="form-control" @input="onChange()"
                                        id="apartmentNumber" placeholder=" ">
                                    <label for="apartmentNumber">Số căn hộ<span class="required-mark">*</span></label>
                                    <div class="help-text">Ví dụ: A101, B202, v.v.</div>
                                    <small v-if="errors?.apartment_number" class="text-danger">{{
                                        errors.apartment_number }}
                                    </small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-label-group">
                                    <input v-model="apartmentForm.floor_number" type="number" min="1" @input="onChange()"
                                        class="form-control" id="floorInput" placeholder=" ">
                                    <label for="floorInput">Số tầng<span class="required-mark">*</span></label>
                                    <small v-if="errors?.floor_number" class="text-danger">{{
                                        errors.floor_number }}
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3 mt-2">
                            <div class="col-md-6">
                                <div class="form-label-group input-with-unit">
                                    <input v-model="apartmentForm.area" type="number" min="1" step="0.1" @input="onChange()"
                                        class="form-control" id="areaInput" placeholder=" ">
                                    <span class="input-unit">m²</span>
                                    <label for="areaInput">Diện tích<span class="required-mark">*</span></label>
                                    <small v-if="errors?.area" class="text-danger">{{
                                        errors.area }}
                                    </small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-label-group">
                                    <select v-model="apartmentForm.ownership_type" class="form-select" id="typeSelect" @change="onChange()">
                                        <option value="" disabled selected>Chọn loại căn hộ</option>
                                        <option value="studio">Studio</option>
                                        <option value="2bedroom">2 Phòng ngủ</option>
                                        <option value="3bedroom">3 Phòng ngủ</option>
                                        <option value="4bedroom">4 Phòng ngủ</option>
                                        <option value="penthouse">Penthouse</option>
                                        <option value="duplex">Duplex</option>
                                    </select>
                                    <label for="typeSelect">Loại căn hộ<span class="required-mark">*</span></label>
                                    <small v-if="errors?.ownership_type" class="text-danger">{{
                                        errors.ownership_type }}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                        <button type="button" class="btn btn-secondary" @click="reset()">Làm mới</button>
                        <button type="submit" class="btn btn-primary px-4">
                            <i class="fas fa-save me-1"></i> Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal xác nhận chuyển hướng -->
    <ConfirmNavigationModal v-model="showConfirmModal" @confirm="confirmNavigation" @cancel="cancelNavigation" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApartmentStore } from '@/stores/apartment'
import { useToast } from 'vue-toastification'
import ConfirmNavigationModal from '@/components/modal/UnsavedChangesModal.vue'


definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const route = useRoute()
const router = useRouter();
const apartmentStore = useApartmentStore();
const toast = useToast();

const apartmentForm = ref({
    apartment_number: '',
    floor_number: '',
    area: '',
    ownership_type: '',
});

const originalApartment = ref(null);
const isLoading = ref(false);
const apartmentId = route.params.id

const errors = ref({});

const reset = () => {
    apartmentForm.value.apartment_number = ''
    apartmentForm.value.floor_number = ''
    apartmentForm.value.area = ''
    apartmentForm.value.ownership_type = ''
    errors.value = null
}

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

onMounted(async () => {
    isLoading.value = true;
    await apartmentStore.detailApartment(apartmentId);
    if (apartmentStore.apartment) {
        apartmentForm.value = { ...apartmentStore.apartment };
        originalApartment.value = JSON.stringify(apartmentStore.apartment);
    }
    isLoading.value = false;
    setupRouteGuard()
});

const updateApartment = async () => {
    const currentData = JSON.stringify(apartmentForm.value);
    if (currentData === originalApartment.value) {
        toast.info("Bạn chưa thay đổi dữ liệu!", { timeout: 3000 });
        return;
    }
    isLoading.value = true;
    errors.value = {};
    try {
        const result = await apartmentStore.updateApartment(apartmentId, apartmentForm.value)
        if (result) {
            toast.success("Cập nhật căn hộ thành công!", { timeout: 3000 });
            errors.value = null
            setEditing(false)
            router.push('/apartment')
        }
    } catch (error) {
        if (error && error.errors) {
            toast.error("Cập nhật căn hộ thất bại!", { timeout: 3000 });
            errors.value = Object.keys(error.errors).reduce((acc, key) => {
                acc[key] = error.errors[key][0];
                return acc;
            }, {});
        }
    }
    isLoading.value = false;
};
</script>

<style scoped>
.form-container {
    max-width: 1140px;
    margin: 2rem auto;
}

.card {
    border: none;
    border-radius: 10px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.card-header {
    background: linear-gradient(45deg, #4e73df, #224abe);
    padding: 1.5rem;
    border-bottom: none;
}

.card-body {
    padding: 2rem;
}

.form-label {
    font-weight: 600;
    color: #495057;
    margin-bottom: 0.5rem;
}

.form-control,
.form-select {
    padding: 0.75rem;
    border-radius: 7px;
    border: 1px solid #ced4da;
    transition: all 0.2s;
}

.form-control:focus,
.form-select:focus {
    border-color: #4e73df;
    box-shadow: 0 0 0 0.25rem rgba(78, 115, 223, 0.25);
}

.input-group-text {
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    border-radius: 7px 0 0 7px;
}

.btn-primary {
    background: linear-gradient(45deg, #4e73df, #224abe);
    border: none;
    padding: 0.75rem;
    font-weight: 600;
    border-radius: 7px;
    transition: all 0.3s;
}

.btn-primary:hover {
    background: linear-gradient(45deg, #224abe, #1e40af);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(33, 37, 41, 0.2);
}

.required-mark {
    color: #dc3545;
    margin-left: 3px;
}

.help-text {
    font-size: 0.8rem;
    color: #6c757d;
    margin-top: 0.25rem;
}

.header-icon {
    margin-right: 10px;
}

.form-section {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 1.1rem;
    color: #4e73df;
    border-bottom: 2px solid #eaecf4;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
}

/* Form label group để tránh đè label */
.form-label-group {
    position: relative;
    margin-bottom: 1rem;
}

.form-label-group>label {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    margin-bottom: 0;
    padding: 0.75rem;
    color: #495057;
    pointer-events: none;
    cursor: text;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    transition: all 0.1s ease-in-out;
}

.form-label-group input:focus~label,
.form-label-group input:not(:placeholder-shown)~label,
.form-label-group textarea:focus~label,
.form-label-group textarea:not(:placeholder-shown)~label,
.form-label-group select:focus~label,
.form-label-group select:not(:placeholder-shown)~label {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    font-size: 12px;
    color: #4e73df;
    background-color: white;
    top: -10px;
    left: 10px;
    z-index: 1;
    padding-left: 5px;
    padding-right: 5px;
}

/* Các style cho input number với đơn vị */
.input-with-unit {
    position: relative;
}

.input-unit {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
    font-weight: 500;
    pointer-events: none;
}

/* Màu cho badge trạng thái */
.status-badge {
    padding: 0.5rem 0.75rem;
    border-radius: 50px;
    font-weight: 500;
    display: inline-block;
}

.status-available {
    background-color: #e8f5e9;
    color: #2e7d32;
}

.status-rented {
    background-color: #e3f2fd;
    color: #1565c0;
}

.status-maintenance {
    background-color: #fff3e0;
    color: #e65100;
}

.status-reserved {
    background-color: #f3e5f5;
    color: #6a1b9a;
}

/* Thêm chút hoạt ảnh cho các phần tử */
.animate-fade {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>