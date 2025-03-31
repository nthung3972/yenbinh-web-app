<template>
    <div class="card shadow-sm p-4 m-4">

        <div v-if="isLoading" class="text-center">
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Đang tải dữ liệu...</span>
            </div>
            <p>Đang tải dữ liệu...</p>
        </div>
        <div v-else>
            <div class="d-flex justify-content-between align-items-center mb-3 p-bottom">
                <h5 class="fw-bold">Danh sách xe</h5>

                <select v-model="vehicleType" @change="onFilter" class="form-select w-25">
                    <option value="">Loại xe</option>
                    <option value="car">Ô tô</option>
                    <option value="motorbike">Xe máy</option>
                    <option value="bicycle">Xe đạp</option>
                </select>

                <div class="input-group w-50">
                    <span class="input-group-text">
                        <Icon name="material-symbols:search" />
                    </span>
                    <input v-model="searchKeyword" @keyup.enter="onSearch" type="text" class="form-control"
                        placeholder="Điền biển số xe hoặc tên căn hộ..." />
                    <button class="btn btn-primary" @click="onSearch">Tìm</button>
                </div>
                <NuxtLink to="/vehicle/create" class="btn btn-primary d-flex align-items-center">
                    <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" /> Thêm xe
                </NuxtLink>
            </div>
            <table class="table table-striped table-hover align-middle" style="table-layout: fixed; width: 100%;">
                <thead class="table-light">
                    <tr>
                        <th style="width: 15%;">Biển số xe</th>
                        <th style="width: 15%;">Loại xe</th>
                        <th style="width: 15%;">Vị trí</th>
                        <th style="width: 15%;">Số căn hộ</th>
                        <th style="width: 15%;">Trạng thái</th>
                        <th style="width: 25%; text-align: center;">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(vehicle, index) in vehicleStore.vehicleList" :key="index">
                        <td>{{ vehicle.license_plate }}</td>
                        <td>{{ vehicle.vehicle_type }}</td>
                        <td>{{ vehicle.parking_slot ? vehicle.parking_slot : '' }}</td>
                        <td>{{ vehicle.apartment_number }}</td>
                        <td>
                            <span :class="vehicle.status === 0 ? 'badge bg-info': 'badge bg-danger'">
                                {{ vehicle.status === 0 ? 'Đang hoạt động' : 'Ngừng hoạt động' }}
                            </span>
                        </td>
                        <td class="d-flex justify-content-center">
                            <NuxtLink to="/" class="btn btn-sm btn-success text-white d-flex align-items-center"
                                style="min-width: 100px;">
                                <Icon name="bxs:detail" size="20" class="me-1" />Chi tiết
                            </NuxtLink>
                            <NuxtLink :to="`/vehicle/edit/${vehicle.vehicle_id}`" class="btn btn-sm btn-warning text-white d-flex align-items-center">
                                <Icon name="basil:edit-solid" size="20" class="me-1"/> Chỉnh sửa
                            </NuxtLink>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination :pagination="vehicleStore.pagination" @page-change="handlePageChange" />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useVehicleStore } from '@/stores/vehicle'
import Pagination from '@/components/pagination/Pagination.vue'

definePageMeta({
    middleware: "auth",
    layout: "dashboard"
})

const vehicleStore = useVehicleStore()
const currentPage = ref(1)
const searchKeyword = ref('')
const vehicleType = ref('')

const isLoading = computed(() => vehicleStore.isLoading);

const handlePageChange = (page) => {
    currentPage.value = page;
    fectVehicleList();
};

const onFilter = () => {
    currentPage.value = 1;
    fectVehicleList();
}

const onSearch = () => {
    currentPage.value = 1;
    fectVehicleList();
};

const fectVehicleList = () => {
    vehicleStore.fetchVehicleList(currentPage.value, '', searchKeyword.value, vehicleType.value)
}

onMounted(fectVehicleList)
</script>

<style scoped>
.d-flex {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style>