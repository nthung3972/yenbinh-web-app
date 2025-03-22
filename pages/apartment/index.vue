<template>
  <div class="card shadow-sm p-3 m-20-0">
        <h5 class="fw-bold">Danh sách căn hộ</h5>
        <div v-if="isLoading" class="text-center">
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Đang tải dữ liệu...</span>
            </div>
            <p>Đang tải dữ liệu...</p>
        </div>
        <div v-else-if="hasError">{{ hasError }}</div>
        <table v-else class="table mt-3">
            <thead class="table-light">
                <tr>
                    <th>Số căn hộ</th>
                    <th>Số tầng</th>
                    <th>Diện tích</th>
                    <th>Chủ căn hộ</th>
                    <th>Số điện thoại</th>
                    <th>Tình trạng căn hộ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(apartment, index) in apartmentStore.apartmentList" :key="index">
                    <td>{{ apartment.apartment_number }}</td>
                    <td>{{ apartment.floor_number }}</td>
                    <td>{{ apartment.area }} m2</td>
                    <td>{{ apartment.residents[0].full_name }}</td>
                    <td>{{ apartment.residents[0].phone_number }}</td>
                    <td>
                        <span :class="apartment.status === 0 ? 'badge bg-info' : 'badge bg-danger'">
                            {{ apartment.status === 0 ? 'Đang sử dụng' : 'Để trống' }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useApartmentStore } from '@/stores/apartment'

definePageMeta({
  middleware: "auth",
  layout: "dashboard"
})

const apartmentStore = useApartmentStore();

const isLoading = computed(() => apartmentStore.isLoading);
const hasError = computed(() => apartmentStore.hasError);

onMounted(async () => {
    await apartmentStore.fetchApartmentListByBuilding();
});
</script>
