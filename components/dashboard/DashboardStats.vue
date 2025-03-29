<template>
    <div class="overview-container">
        <div class="row">
            <!-- Tòa nhà -->
            <div class="col-md-3">
                <div class="card shadow-sm p-3 d-flex flex-row align-items-center">
                    <div class="icon-box bg-primary">
                        <Icon name="mdi:building" size="24" class="text-white" />
                    </div>
                    <div class="ms-3">
                        <h5 class="fw-bold mb-0">{{ processedData.length }}</h5>
                        <p class="text-muted mb-0">{{ processedData.length > 1 ? 'Tòa nhà' : processedData[0].name }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Tổng số căn hộ -->
            <div class="col-md-3">
                <div class="card shadow-sm p-3 d-flex flex-row align-items-center">
                    <div class="icon-box bg-warning">
                        <Icon name="ion:home" size="24" class="text-white" />
                    </div>
                    <div class="ms-3">
                        <h5 class="fw-bold mb-0">{{ totalApartments }}</h5>
                        <p class="text-muted mb-0">Tổng số căn hộ</p>
                    </div>
                </div>
            </div>

            <!-- Tổng số cư dân -->
            <div class="col-md-3">
                <div class="card shadow-sm p-3 d-flex flex-row align-items-center">
                    <div class="icon-box bg-info">
                        <Icon name="ic:baseline-people" size="24" class="text-white" />
                    </div>
                    <div class="ms-3">
                        <h5 class="fw-bold mb-0">{{ totalResidents }}</h5>
                        <p class="text-muted mb-0">Tổng số cư dân</p>
                    </div>
                </div>
            </div>

            <!-- Yêu cầu bảo trì -->
            <div class="col-md-3">
                <div class="card shadow-sm p-3 d-flex flex-row align-items-center">
                    <div class="icon-box bg-secondary">
                        <Icon name="fluent-mdl2:service-off" size="24" class="text-white" />
                    </div>
                    <div class="ms-3">
                        <h5 class="fw-bold mb-0">0</h5>
                        <p class="text-muted mb-0">Yêu cầu bảo trì</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row pt-20">
            <!-- Thẻ 1: Tỷ lệ thu phí -->
            <div class="col-md-4">
                <div class="card shadow-sm border-0">
                    <div class="card-body card">
                        <h6 class="card-title fw-bold">Tỷ lệ thu phí</h6>
                        <h2 class="fw-bold">{{ totalCollectionRate }}%</h2>
                        <p>
                            <span v-if="totalCollectionRateChange >= 0" class="text-success small">
                                ⬆ {{ totalCollectionRateChange }}% so với tháng trước
                            </span>
                            <span v-else class="text-danger small">
                                ⬇ {{ totalCollectionRateChange }}% so với tháng trước
                            </span>
                        </p>
                        <div class="bg-light text-center p-3 rounded">[Biểu đồ tỷ lệ thu phí]</div>
                    </div>
                </div>
            </div>

            <!-- Thẻ 2: Thời gian xử lý khiếu nại -->
            <div class="col-md-4">
                <div class="card shadow-sm border-0">
                    <div class="card-body card">
                        <h6 class="card-title fw-bold">Thời gian xử lý khiếu nại</h6>
                        <h2 class="fw-bold">1.8 ngày</h2>
                        <p class="text-danger small">⬇ 0.5 ngày so với tháng trước</p>
                        <div class="bg-light text-center p-3 rounded">[Biểu đồ thời gian xử lý]</div>
                    </div>
                </div>
            </div>

            <!-- Thẻ 3: Đánh giá dịch vụ -->
            <div class="col-md-4">
                <div class="card shadow-sm border-0">
                    <div class="card-body card">
                        <h6 class="card-title fw-bold">Đánh giá dịch vụ</h6>
                        <h2 class="fw-bold">4.7/5.0</h2>
                        <p class="text-success small">⬆ 0.2 so với tháng trước</p>
                        <div class="bg-light text-center p-3 rounded">[Biểu đồ đánh giá]</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const totalApartments = ref(0);
const totalResidents = ref(0);
const totalCollectionRate = ref(0);
const totalCollectionRateChange = ref(0);

// Nhận props từ component cha
const props = defineProps({
    data: {
        type: [Array, Object],
        default: () => []
    }
})



// Tạo computed property để xử lý dữ liệu Proxy
const processedData = computed(() => {
    if (Array.isArray(props.data)) {
        totalApartments.value = props.data.reduce((sum, building) => sum + building.apartments_count, 0);
        totalResidents.value = props.data.reduce((sum, building) => sum + building.residents_count, 0);
        totalCollectionRate.value = props.data.length > 0
            ? (props.data.reduce((sum, building) => sum + building.collectionRate, 0) / props.data.length).toFixed(2)
            : "0.00";
        totalCollectionRateChange.value = props.data.length > 0
            ? (props.data.reduce((sum, building) => sum + building.collectionRateChange, 0) / props.data.length).toFixed(2)
            : "0.00";
        return props.data
    }
    return []
})
</script>

<style>
.card {
    border-left: 5px solid #4cc9f0;
}

.pt-20 {
    padding-top: 20px;
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

.fw-bold {
    display: flex;
    align-items: center;
}

.fw-bold span {
    padding: 0 5px 0 0;
}

.icon-box {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    /* Bo góc */
}
</style>
