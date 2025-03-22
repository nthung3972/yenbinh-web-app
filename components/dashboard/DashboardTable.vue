<template>
    <div class="card shadow-sm p-3 m-20-0">
        <h5 class="fw-bold">{{ processedData.length > 1 ? 'Tổng quan các tòa nhà' : processedData[0].name }}</h5>
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
                <tr v-for="(building, index) in processedData" :key="index">
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