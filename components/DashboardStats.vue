<template>
    <div class="overview-container">
        <div class="row">
            <div class="col-12 text-center" v-if="isLoading">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">{{ isLoading ? "Đang tải dữ liệu..." : "Thành công" }}</span>
                </div>
            </div>

            <div class="col-md-3" v-if="!isLoading">
                <div class="card shadow-sm p-3">
                    <h5 class="fw-bold">{{ useStore.overview.length }}</h5>
                    <p class="text-muted">Tòa nhà</p>
                </div>
            </div>
            <div class="col-md-3" v-if="!isLoading">
                <div class="card shadow-sm p-3">
                    <h5 class="fw-bold">{{ totalApartments }}</h5>
                    <p class="text-muted">Tổng số căn hộ</p>
                </div>
            </div>
            <div class="col-md-3" v-if="!isLoading">
                <div class="card shadow-sm p-3">
                    <h5 class="fw-bold">{{ totalResidents }}</h5>
                    <p class="text-muted">Tổng số cư dân</p>
                </div>
            </div>
            <div class="col-md-3" v-if="!isLoading">
                <div class="card shadow-sm p-3">
                    <h5 class="fw-bold">0</h5>
                    <p class="text-muted">Yêu cầu bảo trì</p>
                </div>
            </div>
        </div>

        <div class="card shadow-sm p-3 m-20-0">
            <h5 class="fw-bold">Tổng quan các tòa nhà</h5>
            <table class="table mt-3">
                <thead class="table-light">
                    <tr>
                        <th>Tòa nhà</th>
                        <th>Căn hộ</th>
                        <th>Cư dân</th>
                        <th>Tỷ lệ sử dụng</th>
                        <th>Thu phí tháng này</th>
                        <th>So với tháng trước</th>
                        <th>Kiếu nại</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(building, index) in useStore.overview" :key="index">
                        <td>{{ building.name }}</td>
                        <td>{{ building.apartments_count }}</td>
                        <td>{{ building.residents_count }}</td>
                        <td>{{ building.occupied_rate }}%</td>
                        <td>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar"
                                    :style="{ width: building.collection_rate + '%' }"
                                    :aria-valuenow="building.collection_rate" aria-valuemin="0" aria-valuemax="100">
                                    {{ building.collection_rate }}%
                                </div>
                            </div>
                        </td>
                        <td>
                            <span class="text-success" v-if="building.collection_rate_change > 0">
                                Tăng {{ building.collection_rate_change }}%
                            </span>
                            <span class="text-danger" v-else>
                                Giảm {{ building.collection_rate_change }}%
                            </span>
                        </td>
                        <td>0</td>
                        <td>
                            <span :class="building.status === 0 ? 'badge bg-info' : 'badge bg-danger'">
                                {{ building.status === 0 ? 'Đang hoạt động' : 'Ngừng hoạt động' }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useBuildingStore } from "~/stores/building";

const useStore = useBuildingStore();
const totalApartments = ref(0);
const totalResidents = ref(0);
const isLoading = ref(true);
const collectionRate = ref(0);
const rateChange = ref(0);

onMounted(async () => {
    isLoading.value = true;
    await useStore.fetchOverview();

    totalApartments.value = useStore.overview.reduce((sum, building) => sum + building.apartments_count, 0);
    totalResidents.value = useStore.overview.reduce((sum, building) => sum + building.residents_count, 0);
    rateChange.value = 

    // collectionRate.value = store.overview.reduce((sum, b) => sum + b.collection_rate, 0) / store.overview.length;
    // rateChange.value = store.overview.reduce((sum, b) => sum + b.collection_rate_change, 0) / store.overview.length;

    isLoading.value = false;
});
</script>

<style>
.card {
    border-left: 5px solid #4cc9f0;
}

.m-20-0 {
    margin: 20px 0;
}

.progress {
    margin: 5px 0 0 0;
}

.progress-bar {
    background-color: #4cc9f0;
}

.badge {
    background-color: #4cc9f0;
    border-radius: 20px;
    padding: 7px 10px 10px 10px;
}
</style>
