<template>
    <div>
        <div class="row">
            <div class="col-12">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h2 class="h4 mb-0">Chỉnh sửa thông tin căn hộ</h2>
                    </div>
                    <!-- Hiển thị loading khi đang tải -->
                    <div v-if="isLoading" class="text-center">
                        <div class="spinner-border spinner-border-sm me-2" role="status">
                            <span class="visually-hidden">Đang tải dữ liệu...</span>
                        </div>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                    <div v-else class="card-body">
                        <form @submit.prevent="updateApartment">
                            <div class="row">
                                <div class="col-md-1212 mb-3">
                                    <label class="form-label">Số căn hộ</label>
                                    <input v-model="apartmentForm.apartment_number" type="text" id="apartment_number"
                                        class="form-control" placeholder="Nhập số căn hộ" />
                                    <p v-if="errors.apartment_number" class="text-danger">{{ errors.apartment_number }}
                                    </p>
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Số tầng</label>
                                    <input v-model="apartmentForm.floor_number" type="number" id="floor_number"
                                        class="form-control" placeholder="Nhập số tầng" />
                                    <p v-if="errors.floor_number" class="text-danger">{{ errors.floor_number }}</p>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-1212 mb-3">
                                    <label class="form-label">Diện tích (m²)</label>
                                    <input v-model="apartmentForm.area" type="number" id="area" class="form-control"
                                        placeholder="Nhập diện tích" />
                                    <p v-if="errors.area" class="text-danger">{{ errors.area }}</p>
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Loại căn hộ</label>
                                    <input v-model="apartmentForm.ownership_type" type="text" id="ownership_type"
                                        class="form-control" placeholder="Nhập loại căn hộ" />
                                    <p v-if="errors.ownership_type" class="text-danger">{{ errors.ownership_type }}</p>
                                </div>
                            </div>

                            <hr class="my-4">

                            <div class="d-flex justify-content-center mt-4">
                                <button type="button" class="btn btn-secondary" @click="redirectToApartment">
                                    Hủy thay đổi
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useApartmentStore } from '@/stores/apartment';
import { useToast } from 'vue-toastification';


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

const redirectToApartment = () => {
    router.push(`/apartment`)
}


onMounted(async () => {
    isLoading.value = true;
    await apartmentStore.detailApartment(apartmentId);
    if (apartmentStore.apartment) {
        apartmentForm.value = { ...apartmentStore.apartment };
        originalApartment.value = JSON.stringify(apartmentStore.apartment);
    }
    isLoading.value = false;
});

const updateApartment = async () => {
    console.log('apartmentForm.value', apartmentForm.value)
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
        }
    } catch (error) {
        if (error && error.errors) {
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
.edit-apartment {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.input-field {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 4px;
}

.resident-card {
    background: #f9f9f9;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 6px;
}

.btn {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-danger {
    background: #dc3545;
    color: white;
}

.btn-success {
    background: #28a745;
    color: white;
}

.d-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
</style>