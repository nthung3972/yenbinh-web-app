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
      <table class="table table-striped table-hover align-middle" style="table-layout: fixed; width: 100%;">
        <thead class="table-light">
          <tr>
            <th style="width: 15%;">Tòa nhà</th>
            <th style="width: 30%;">Vị trí</th>
            <th style="width: 10%;">Số tầng</th>
            <th style="width: 20%;">Người quản lý</th>
            <th style="width: 15%;">Trạng thái</th>
            <th style="width: 20%; text-align: center;">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(building, index) in buildingStore.buildingList" :key="index">
            <td>{{ building.name }}</td>
            <td>{{ building.address }}</td>
            <td>{{ building.floors }}</td>
            <td>{{ building.staff_names }}</td>
            <td>
              <span :class="building.status === 0 ? 'badge bg-info' : 'badge bg-danger'">
                {{ building.status === 0 ? 'Đang hoạt động' : 'Ngừng hoạt động' }}
              </span>
            </td>
            <td class="d-flex justify-content-center">
              <NuxtLink to="/" style="display: flex;" class="btn btn-sm btn-success text-white align-items-center">
                <Icon name="bxs:detail" size="20" class="me-1" />Xem
              </NuxtLink>
              <NuxtLink to="/" style="display: flex;" class="btn btn-sm btn-warning text-white align-items-center">
                <Icon name="bxs:detail" size="20" class="me-1" />Sửa
              </NuxtLink>
              <button type="button" style="display: flex;" class="btn btn-danger btn-sm" data-bs-toggle="modal"
                data-bs-target="#deleteApartmentModal" @click="setSelectedBuilding(building.building_id)">
                <Icon name="material-symbols:delete" size="20" class="me-1" />Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination :pagination="buildingStore.pagination" @page-change="handlePageChange" />
    </div>
  </div>


  <!-- Modal Xóa Căn Hộ -->
  <div class="modal fade" id="deleteBuildingModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="deleteBuilding" novalidate>
          <div class="modal-header">
            <h5 class="modal-title">Xác Nhận Xóa Tòa Nhà</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Bạn có chắc chắn muốn xóa tòa nhà này không?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="submit" class="btn btn-danger">Xóa</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBuildingStore } from '@/stores/building'
import Pagination from '@/components/pagination/Pagination.vue'
import { useToast } from 'vue-toastification'

definePageMeta({
  middleware: "auth",
  layout: "dashboard"
})

const buildingStore = useBuildingStore()
const currentPage = ref(1)
const searchKeyword = ref('')
const building_id = ref('')
const toast = useToast()

const isLoading = computed(() => buildingStore.isLoading);
const hasError = computed(() => buildingStore.hasError);

const setSelectedBuilding = (id) => {
  building_id.value = parseInt(id);
};

const handlePageChange = (page) => {
  currentPage.value = page;
  fectBuildingList();
};

const onSearch = () => {
  currentPage.value = 1;
  fectBuildingList();
};

const fectBuildingList = () => {
  buildingStore.fetchBuildingList(currentPage.value, '', searchKeyword.value)
}

const deleteBuilding = async () => {
  try {
      await buildingStore.deleteBuilding(building_id.value)
      document.getElementById('deleteBuildingModal').querySelector('[data-bs-dismiss="modal"]').click()
      toast.success('Xóa tòa nhà thành công!')
      fectBuildingList();
  } catch (error) {
      toast.error('Đã xảy ra lỗi khi xóa nhân viên!')
  }
}

onMounted(fectBuildingList)
</script>

<style scoped>
.d-flex {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style>