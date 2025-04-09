<template>
    <div class="card shadow-sm p-4 m-4">

        <div v-if="isLoading" class="text-center">
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">Đang tải dữ liệu...</span>
            </div>
            <p>Đang tải dữ liệu...</p>
        </div>
        <div v-else-if="hasError">{{ hasError }}</div>
        <div v-else>
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <!-- <h5 class="fw-bold text-primary mb-0">Danh Sách Căn Hộ</h5> -->
            <h5 class="fw-bold text-primary mb-0">
                🏢 Danh sách xe
            </h5>

            <div class="d-flex align-items-center gap-3">
                <select v-model="vehicleType" @change="onFilter" class="form-select w-25">
                    <option value="">Loại xe</option>
                    <option value="car">Ô tô</option>
                    <option value="motorbike">Xe máy</option>
                    <option value="bicycle">Xe đạp</option>
                </select>

                <!-- Ô tìm kiếm -->
    <div class="input-group">
      <span class="input-group-text bg-white">
        <Icon name="material-symbols:search" />
      </span>
      <input
        v-model="searchKeyword"
        @keyup.enter="onSearch"
        type="text"
        class="form-control"
        placeholder="Nhập biển số xe..."
      />
      <button class="btn btn-outline-primary" @click="onSearch">
        Tìm
      </button>
    </div>
    <NuxtLink
      to="/vehicle/create"
      class="btn btn-primary d-flex align-items-center justify-content-center"
      style="white-space: nowrap;"
    >
      <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" />
      Thêm xe mới
    </NuxtLink>
            </div>
        </div>
            <table class="table table-hover align-middle" style="table-layout: fixed; width: 100%;">
        <thead class="table-light sticky-top" style="z-index: 1;">
            <tr>
                <th style="width: 15%;">Biển số xe</th>
                <th style="width: 13%;">Loại xe</th>
                <th style="width: 10%;">Vị trí đỗ</th>
                <th style="width: 12%;">Mã căn hộ</th>
                <th style="width: 15%;">Trạng thái</th>
                <th style="width: 15%;">Cập nhật bởi</th>
                <th style="width: 20%; text-align: center;">Hành động</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(vehicle, index) in vehicleStore.vehicleList" :key="index">
                <td>{{ vehicle.license_plate }}</td>
                <td>{{ vehicle.vehicle_type }}</td>
                <td>{{ vehicle.parking_slot ?? '----' }}</td>
                <td>{{ vehicle.apartment_number }}</td>
                <td>
                    <span 
                        :class="[
                            'badge', 
                            vehicle.status === 0 ? 'bg-success' : 'bg-secondary'
                        ]"
                    >
                        {{ vehicle.status === 0 ? 'Đang hoạt động' : 'Ngừng hoạt động' }}
                    </span>
                </td>
                <td>{{ vehicle.updated_by?.name ?? '----' }}</td>
                <td class="text-center">
                    <div class="btn-group gap-2">
                        <NuxtLink 
                            to="/" 
                            class="btn btn-sm btn-outline-success d-flex align-items-center px-3 py-2"
                        >
                            <Icon name="bxs:detail" size="16" class="me-1" /> Xem
                        </NuxtLink>
                        <NuxtLink 
                            :to="`/vehicle/edit/${vehicle.vehicle_id}`" 
                            class="btn btn-sm btn-outline-warning d-flex align-items-center px-3 py-2"
                        >
                            <Icon name="basil:edit-solid" size="16" class="me-1" /> Sửa
                        </NuxtLink>
                    </div>
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
const hasError = computed(() => vehicleStore.hasError);

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
    console.log(vehicleStore.vehicleList)
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