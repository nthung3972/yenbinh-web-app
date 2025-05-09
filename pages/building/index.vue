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
      <div class="d-flex justify-content-between align-items-center mb-3 p-bottom">
        <h5 class="fw-bold">Danh sách tòa nhà</h5>
        <div class="input-group w-50">
          <span class="input-group-text">
            <Icon name="material-symbols:search" />
          </span>
          <input v-model="searchKeyword" @keyup.enter="onSearch" type="text" class="form-control"
            placeholder="Điền tên tòa nhà..." />
          <button class="btn btn-primary" @click="onSearch">Tìm</button>
        </div>
        <NuxtLink to="/building/create" class="btn btn-primary d-flex align-items-center">
          <Icon name="ic:baseline-add-circle-outline" size="20" class="me-1" /> Thêm tòa nhà
        </NuxtLink>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle" style="table-layout: fixed; width: 100%;">
          <thead class="table-light sticky-top" style="z-index: 1;">
            <tr>
              <th style="width: 5%;">#</th>
              <th style="width: 20%;">Tên tòa nhà</th>
              <th style="width: 15%;">Hình ảnh</th>
              <th style="width: 10%;">Số tầng</th>
              <th style="width: 10%;">Diện tích</th>
              <th style="width: 10%;">Phí dịch vụ</th>
              <th style="width: 10%;">Loại tòa nhà</th>
              <th style="width: 15%;">Trạng thái</th>
              <th style="width: 20%; text-align: center;">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(building, index) in buildingStore.buildingList" :key="index">
              <td>{{ index +1 }}</td>
              <td>{{ building.name }}</td>
              <td style="height: 70px;">
                <img v-if="building.image" :src="building.image" class="building-image rounded"
                  alt="Hình ảnh tòa nhà" loading="lazy" />
                <img v-else src="" alt="">
              </td>
              <td>{{ building.floors }}</td>
              <td>{{ building.total_area }} (m²)</td>
              <td>{{ formatVND(building.management_fee_per_m2) }}đ</td>
              <td>{{ getBuildingType(building.building_type) }}</td>
              <td>
                <span :class="[
                  'badge',
                  building.status === 0 ? 'bg-success' : 'bg-secondary'
                ]">
                  {{ building.status === 0 ? 'Đang hoạt động' : 'Ngừng hoạt động' }}
                </span>
              </td>
              <td class="text-center">
                <div class="btn-group gap-2">
                  <NuxtLink :to="`/building/detail/${building.building_id}`" class="btn btn-sm btn-outline-success d-flex align-items-center px-3 py-2">
                    <Icon name="bxs:detail" size="16" class="me-1" /> Xem
                  </NuxtLink>
                  <NuxtLink :to="`/building/edit/${building.building_id}`"
                    class="btn btn-sm btn-outline-warning d-flex align-items-center px-3 py-2">
                    <Icon name="bxs:edit-alt" size="16" class="me-1" /> Sửa
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination :pagination="buildingStore.pagination" @page-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBuildingStore } from '@/stores/building'
import Pagination from '@/components/pagination/Pagination.vue'

definePageMeta({
  middleware: "auth",
  layout: "dashboard"
})

const buildingStore = useBuildingStore()
const currentPage = ref(1)
const searchKeyword = ref('')
const { formatVND } = useCurrencyFormat()

const getBuildingType = (type) => {
    if (type === 'residential') return 'Chung cư'
    if (type === 'commercial') return 'Văn phòng'
    if (type === 'mixed') return ''
}

const isLoading = computed(() => buildingStore.isLoading);
const hasError = computed(() => buildingStore.hasError);

const handlePageChange = (page) => {
  currentPage.value = page;
  fectBuildingList();
};

const onSearch = () => {
  currentPage.value = 1;
  fectBuildingList();
};

const fectBuildingList = async () => {
  await buildingStore.fetchBuildingList(currentPage.value, '', searchKeyword.value)
}

onMounted(fectBuildingList)
</script>

<style scoped>
/* Tùy chỉnh kích thước ảnh trong cột Hình ảnh */
.building-image {
  width: 100px;
  max-height: 70px;
  object-fit: cover;
}
</style>
