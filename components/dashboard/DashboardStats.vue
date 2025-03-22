<template>
    <div class="overview-container">
        <div class="row">
            <div class="col-md-3">
                <div class="card shadow-sm p-3">
                    <h5 class="fw-bold">{{ processedData.length }}</h5>
                    <p class="text-muted">{{ processedData.length > 1 ? 'Tòa nhà' : processedData[0].name }}</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card shadow-sm p-3">
                    <h5 class="fw-bold">{{ totalApartments }}</h5>
                    <p class="text-muted">Tổng số căn hộ</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card shadow-sm p-3">
                    <h5 class="fw-bold">{{ totalResidents }}</h5>
                    <p class="text-muted">Tổng số cư dân</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card shadow-sm p-3">
                    <h5 class="fw-bold">0</h5>
                    <p class="text-muted">Yêu cầu bảo trì</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const totalApartments = ref(0);
const totalResidents = ref(0);

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
    return props.data
  }
  return []
})
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
