<template>
    <div class="card shadow-sm p-3 mt-20">
        <h5 class="fw-bold">{{ processedData.length > 1 ? 'Tổng quan các tòa nhà' : processedData[0]?.name }}</h5>
        <table class="table mt-3">
            <thead class="table-primary">
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
                <tr v-for="(building, index) in processedData" :key="index">
                    <td>{{ building.name }}</td>
                    <td>{{ building.apartments_count }}</td>
                    <td>{{ building.residents_count }}</td>
                    <td>{{ building.occupancyRate }}%</td>
                    <td>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar"
                                :style="{ width: building.collectionRate + '%' }"
                                :aria-valuenow="building.collectionRate" aria-valuemin="0" aria-valuemax="100">
                                {{ building.collectionRate }}%
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="text-success" v-if="building.collectionRateChange >= 0">
                            Tăng {{ building.collectionRateChange }}%
                        </span>
                        <span class="text-danger" v-else>
                            Giảm {{ building.collectionRateChange }}%
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
</template>

<script setup>
import { computed } from 'vue'

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
    return props.data
  }
  return []
})
</script>

<style scoped>
.mt-20 {
    margin-top: 20px;
}
</style>